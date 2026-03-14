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
    permission_classes = [AllowAny]

    def get(self, request):
        now = __import__('datetime').datetime.now()
        data = []
        for i in range(60, -1, -1):
            d = now - __import__('datetime').timedelta(days=i)
            timeframe = "year"
            if i <= 30: timeframe = "month"
            if i <= 7: timeframe = "week"
            data.append({
                "date": d.strftime("%Y-%m-%d"),
                "label": d.strftime("%b %d"),
                "views": __import__('random').randint(0, 500) + (60 - i) * 10,
                "favorites": __import__('random').randint(0, 50) + (60 - i) * 2,
                "timeframe": timeframe,
            })
        return Response(data)

# --- Favorite APIs ---
from .models import Favorite

class FavoriteListCreateView(generics.ListCreateAPIView):
    serializer_class = FavoriteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Favorite.objects.filter(customer=self.request.user)

    def perform_create(self, serializer):
        serializer.save(customer=self.request.user)

    def create(self, request, *args, **kwargs):
        # Prevent duplicate favorites
        company_id = request.data.get('company')
        if Favorite.objects.filter(customer=request.user, company_id=company_id).exists():
            return Response({"detail": "Already favorited."}, status=400)
        return super().create(request, *args, **kwargs)

class FavoriteDeleteView(generics.DestroyAPIView):
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Favorite.objects.filter(customer=self.request.user)
    
    def get_object(self):
        # We delete by company ID in the URL
        company_id = self.kwargs.get('company_id')
        return generics.get_object_or_404(self.get_queryset(), company_id=company_id)