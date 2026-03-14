from rest_framework import generics
from rest_framework.permissions import AllowAny
from .models import Company, Customer
from .serializers import (
    CompanySerializer, CustomerSerializer,
    CompanyTokenObtainPairSerializer, CustomerTokenObtainPairSerializer
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