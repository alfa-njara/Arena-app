from rest_framework import generics
from rest_framework.permissions import AllowAny
from .models import Company, Customer
from .serializers import (
    CompanySerializer, CustomerSerializer,
    CompanyTokenObtainPairSerializer, CustomerTokenObtainPairSerializer,
    FavoriteSerializer
)
from rest_framework_simplejwt.views import TokenObtainPairView
from django.db.models import Count, Q, Case, When, Value, IntegerField, ExpressionWrapper

# --- Signup ---
class CompanyCreateView(generics.CreateAPIView):
    queryset = Company.objects.all()
    serializer_class = CompanySerializer
    permission_classes = [AllowAny]

class CustomerCreateView(generics.CreateAPIView):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer
    permission_classes = [AllowAny]

# --- Login (JWT) ---
class CompanyTokenObtainPairView(TokenObtainPairView):
    serializer_class = CompanyTokenObtainPairSerializer

class CustomerTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomerTokenObtainPairSerializer

# --- Company APIs ---
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response

class CompanyListView(generics.ListAPIView):
    serializer_class = CompanySerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        # Annotate with counts of various company-related interactions
        return Company.objects.filter(is_active=True, is_staff=False).annotate(
            total_views=Count(
                'visited_by', 
                filter=Q(visited_by__visit_type='profile_view'),
                distinct=True
            ),
            total_visits=Count(
                'visited_by', 
                filter=Q(visited_by__visit_type='website_click'),
                distinct=True
            ),
            total_favorites=Count(
                'favorited_by',
                distinct=True
            )
        ).annotate(
            ranking_score=ExpressionWrapper(
                (Count('visited_by', filter=Q(visited_by__visit_type='profile_view'), distinct=True) * 1) + 
                (Count('visited_by', filter=Q(visited_by__visit_type='website_click'), distinct=True) * 3) + 
                (Count('favorited_by', distinct=True) * 5) +
                Case(
                    When(is_premium=True, then=Value(15)),
                    default=Value(0),
                    output_field=IntegerField()
                ),
                output_field=IntegerField()
            )
        ).order_by('-ranking_score', '-created_at')

class CompanyProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = CompanySerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user # This assumes Token authentication resolves to Company

class CompanyStatsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        if not hasattr(user, 'name'):
            return Response({"error": "Only companies can view stats."}, status=403)
            
        from django.utils import timezone
        from .models import CompanyVisit, Favorite
        from datetime import timedelta
        
        now = timezone.now()
        data = []
        for i in range(30, -1, -1):
            d = now - timedelta(days=i)
            views = CompanyVisit.objects.filter(company=user, created_at__date=d.date(), visit_type='profile_view').count()
            clicks = CompanyVisit.objects.filter(company=user, created_at__date=d.date(), visit_type='website_click').count()
            favorites = Favorite.objects.filter(company=user, created_at__date=d.date()).count()
            
            timeframe = "year"
            if i <= 30: timeframe = "month"
            if i <= 7: timeframe = "week"
            
            data.append({
                "date": d.strftime("%Y-%m-%d"),
                "label": d.strftime("%b %d"),
                "views": views,
                "visits": clicks,
                "favorites": favorites,
                "timeframe": timeframe
            })
            
        recent_favorites = Favorite.objects.filter(company=user).select_related('customer', 'company_user').order_by('-created_at')[:15]
        recent_visits = CompanyVisit.objects.filter(company=user).select_related('customer', 'company_user').order_by('-created_at')[:15]
        
        feed = []
        for f in recent_favorites:
            name = f.customer.full_name if f.customer else (f.company_user.name if f.company_user else "Unknown")
            feed.append({"type": "favorite", "user": name, "date": f.created_at})
        for v in recent_visits:
            name = v.customer.full_name if v.customer else (v.company_user.name if v.company_user else "Anonymous")
            feed.append({
                "type": "visit", 
                "user": name, 
                "date": v.created_at, 
                "visit_type": v.visit_type
            })
            
        feed.sort(key=lambda x: x['date'], reverse=True)
        feed = feed[:15]
        
        for item in feed:
            item['time_label'] = item['date'].strftime("%H:%M")
            item['label'] = item['date'].strftime("%b %d")
            del item['date']

        total_views = CompanyVisit.objects.filter(company=user, visit_type='profile_view').count()
        total_visits = CompanyVisit.objects.filter(company=user, visit_type='website_click').count()
        total_favs = Favorite.objects.filter(company=user).count()
        
        return Response({
            "chart_data": data,
            "recent_activity": feed,
            "total_views": total_views,
            "total_visits": total_visits,
            "total_favorites": total_favs,
            "growth": "+0%"
        })

# --- Visit & Favorite APIs ---
from .models import Favorite, CompanyVisit

class CompanyVisitCreateView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, company_id):
        from rest_framework import generics
        from .models import Company, CompanyVisit
        from django.utils import timezone
        from datetime import timedelta
        
        company = generics.get_object_or_404(Company, id=company_id)
        user = request.user
        visit_type = request.data.get('visit_type', 'profile_view')
        
        # 1. Determine unique identifier for the visitor (Robust identification)
        ip_address = None
        remote_addr = request.META.get('HTTP_X_FORWARDED_FOR')
        if remote_addr:
            ip_address = remote_addr.split(',')[0].strip()
        else:
            ip_address = request.META.get('REMOTE_ADDR')
            
        # 2. Build visitor filters for history check
        visitor_filters = {"company": company, "visit_type": visit_type}
        if getattr(user, 'is_authenticated', False):
            if hasattr(user, 'full_name'): # Customer
                visitor_filters["customer"] = user
            else: # Company User
                visitor_filters["company_user"] = user
        else:
            visitor_filters["ip_address"] = ip_address
            visitor_filters["customer__isnull"] = True
            visitor_filters["company_user__isnull"] = True

        # 3. Check for Anti-Spam Limits
        now = timezone.now()
        
        # BURST PROTECTION: Skip if any visit in the last 3 seconds
        burst_threshold = now - timedelta(seconds=3)
        if CompanyVisit.objects.filter(**visitor_filters, created_at__gte=burst_threshold).exists():
            return Response({"status": "Burst protected", "detail": "Too fast"}, status=200)

        # 15-MINUTE QUOTA: Max 3 visits of this type per 15 minutes
        quota_threshold = now - timedelta(minutes=15)
        recent_count = CompanyVisit.objects.filter(**visitor_filters, created_at__gte=quota_threshold).count()
        if recent_count >= 3:
            return Response({"status": "Quota reached", "detail": "Max 3 views per 15 mins"}, status=200)

        # 4. Create new visit
        if getattr(user, 'is_authenticated', False):
            if hasattr(user, 'full_name'): # Customer
                CompanyVisit.objects.create(company=company, customer=user, ip_address=ip_address, visit_type=visit_type)
            else: # Company User
                if str(user.id) != str(company_id): # Don't track visits to own profile
                    CompanyVisit.objects.create(company=company, company_user=user, ip_address=ip_address, visit_type=visit_type)
        else: # Anonymous
            CompanyVisit.objects.create(company=company, ip_address=ip_address, visit_type=visit_type)
            
        return Response({"status": "Success", "visit_type": visit_type})

class FavoriteListCreateView(generics.ListCreateAPIView):
    serializer_class = FavoriteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if hasattr(user, 'full_name'):
            return Favorite.objects.filter(customer=user)
        return Favorite.objects.filter(company_user=user)

    def perform_create(self, serializer):
        user = self.request.user
        if hasattr(user, 'full_name'):
            serializer.save(customer=user)
        else:
            serializer.save(company_user=user)

    def create(self, request, *args, **kwargs):
        company_id = request.data.get('company')
        user = request.user
        
        # Prevent self-favoriting
        if hasattr(user, 'name') and str(user.id) == str(company_id):
            return Response({"detail": "You cannot favorite your own company."}, status=400)

        # Prevent duplicate favorites
        if hasattr(user, 'full_name'):
            if Favorite.objects.filter(customer=user, company_id=company_id).exists():
                return Response({"detail": "Already favorited."}, status=400)
        else:
            if Favorite.objects.filter(company_user=user, company_id=company_id).exists():
                return Response({"detail": "Already favorited."}, status=400)
                
        return super().create(request, *args, **kwargs)

class FavoriteDeleteView(generics.DestroyAPIView):
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if hasattr(user, 'full_name'):
            return Favorite.objects.filter(customer=user)
        return Favorite.objects.filter(company_user=user)
    
    def get_object(self):
        company_id = self.kwargs.get('company_id')
        return generics.get_object_or_404(self.get_queryset(), company_id=company_id)

class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        from .serializers import ChangePasswordSerializer
        serializer = ChangePasswordSerializer(data=request.data)

        if serializer.is_valid():
            if not request.user.check_password(serializer.validated_data.get("old_password")):
                return Response({"old_password": ["Incorrect old password."]}, status=400)
            
            request.user.set_password(serializer.validated_data.get("new_password"))
            request.user.save()
            return Response({"status": "success", "message": "Password updated successfully."}, status=200)

        return Response(serializer.errors, status=400)

# --- Admin APIs ---
from rest_framework.permissions import IsAdminUser

class AdminStatsView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        from django.utils import timezone
        from datetime import timedelta
        from django.db.models import Count
        from .models import CompanyVisit, Favorite
        
        now = timezone.now()
        thirty_days_ago = now - timedelta(days=30)
        twenty_four_hours_ago = now - timedelta(hours=24)

        total_companies = Company.objects.filter(is_staff=False).count()
        active_companies = Company.objects.filter(is_staff=False, is_active=True).count()
        premium_companies = Company.objects.filter(is_staff=False, is_premium=True).count()
        
        total_customers = Customer.objects.filter(is_staff=False).count()
        active_customers = Customer.objects.filter(is_staff=False, is_active=True).count()

        # Online now (users active within the last 5 minutes)
        five_minutes_ago = now - timedelta(minutes=5)
        online_companies = Company.objects.filter(is_staff=False, last_activity__gte=five_minutes_ago).count()
        online_customers = Customer.objects.filter(is_staff=False, last_activity__gte=five_minutes_ago).count()

        # Platform Activity
        total_views = CompanyVisit.objects.filter(visit_type='profile_view').count()
        total_site_visits = CompanyVisit.objects.filter(visit_type='website_click').count()
        total_favorites = Favorite.objects.count()

        # Registration History (30 Days)
        history = []
        for i in range(29, -1, -1):
            date = (now - timedelta(days=i)).date()
            comp_count = Company.objects.filter(is_staff=False, created_at__date=date).count()
            cust_count = Customer.objects.filter(is_staff=False, created_at__date=date).count()
            history.append({
                "date": date.strftime("%Y-%m-%d"),
                "label": date.strftime("%b %d"),
                "companies": comp_count,
                "customers": cust_count,
                "total": comp_count + cust_count
            })

        # Recent signups (last 5, non-staff)
        recent_companies = CompanySerializer(Company.objects.filter(is_staff=False).order_by('-id')[:5], many=True).data
        recent_customers = CustomerSerializer(Customer.objects.filter(is_staff=False).order_by('-id')[:5], many=True).data

        return Response({
            "stats": {
                "total_companies": total_companies,
                "active_companies": active_companies,
                "premium_companies": premium_companies,
                "total_customers": total_customers,
                "active_customers": active_customers,
                "online_now": online_companies + online_customers,
                "total_engagement": total_views + total_site_visits + total_favorites,
                "total_profile_views": total_views,
                "total_site_visits": total_site_visits,
                "total_favorites": total_favorites,
                "premium_ratio": round((premium_companies / total_companies * 100) if total_companies > 0 else 0, 1),
                "total_registrations": total_companies + total_customers
            },
            "history": history,
            "recent_signups": {
                "companies": recent_companies,
                "customers": recent_customers
            }
        })

class AdminCompanyListView(generics.ListAPIView):
    queryset = Company.objects.filter(is_staff=False).order_by('-id')
    serializer_class = CompanySerializer
    permission_classes = [IsAdminUser]

class AdminCustomerListView(generics.ListAPIView):
    queryset = Customer.objects.filter(is_staff=False).order_by('-id')
    serializer_class = CustomerSerializer
    permission_classes = [IsAdminUser]

class AdminUserActionView(APIView):
    permission_classes = [IsAdminUser]

    def post(self, request):
        user_id = request.data.get("user_id")
        user_type = request.data.get("user_type") # 'company' or 'customer'
        action = request.data.get("action") # 'toggle_active' or 'delete'

        if user_type == 'company':
            user = generics.get_object_or_404(Company, id=user_id)
        else:
            user = generics.get_object_or_404(Customer, id=user_id)

        if action == 'toggle_active':
            user.is_active = not user.is_active
            user.save()
            return Response({"status": "success", "is_active": user.is_active})
        elif action == 'toggle_premium':
            if user_type != 'company':
                return Response({"error": "Premium is only for companies"}, status=400)
            user.is_premium = not user.is_premium
            user.save()
            return Response({"status": "success", "is_premium": user.is_premium})
        elif action == 'delete':
            user.delete()
            return Response({"status": "deleted"})

        return Response({"error": "Invalid action"}, status=400)
