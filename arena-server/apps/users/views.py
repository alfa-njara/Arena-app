from rest_framework import generics
from rest_framework.permissions import AllowAny
from .models import Company, Customer
from .serializers import (
    CompanySerializer, CustomerSerializer,
    CompanyTokenObtainPairSerializer, CustomerTokenObtainPairSerializer,
    FavoriteSerializer
)
from rest_framework_simplejwt.views import TokenObtainPairView

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
    queryset = Company.objects.filter(is_active=True)
    serializer_class = CompanySerializer
    permission_classes = [AllowAny]

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
            views = CompanyVisit.objects.filter(company=user, created_at__date=d.date()).count()
            favorites = Favorite.objects.filter(company=user, created_at__date=d.date()).count()
            
            timeframe = "year"
            if i <= 30: timeframe = "month"
            if i <= 7: timeframe = "week"
            
            data.append({
                "date": d.strftime("%Y-%m-%d"),
                "label": d.strftime("%b %d"),
                "views": views,
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
            feed.append({"type": "visit", "user": name, "date": v.created_at})
            
        feed.sort(key=lambda x: x['date'], reverse=True)
        feed = feed[:15]
        
        for item in feed:
            item['time_label'] = item['date'].strftime("%H:%M")
            item['label'] = item['date'].strftime("%b %d")
            del item['date']

        total_views = CompanyVisit.objects.filter(company=user).count()
        total_favs = Favorite.objects.filter(company=user).count()
        
        return Response({
            "chart_data": data,
            "recent_activity": feed,
            "total_views": total_views,
            "total_favorites": total_favs,
            "growth": "+0%"
        })

# --- Visit & Favorite APIs ---
from .models import Favorite, CompanyVisit

class CompanyVisitCreateView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, company_id):
        from rest_framework import generics
        from .models import Company
        company = generics.get_object_or_404(Company, id=company_id)
        user = request.user
        
        if getattr(user, 'is_authenticated', False):
            if hasattr(user, 'full_name'):
                CompanyVisit.objects.create(company=company, customer=user)
            else:
                if str(user.id) != str(company_id):
                    CompanyVisit.objects.create(company=company, company_user=user)
        else:
            CompanyVisit.objects.create(company=company)
            
        return Response({"status": "Visit logged"})

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