from django.urls import path
from .views import (
    CompanyCreateView, CustomerCreateView,
    CompanyTokenObtainPairView, CustomerTokenObtainPairView
)
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    # Signup
    path("companies/", CompanyCreateView.as_view(), name="company-signup"),
    path("customers/", CustomerCreateView.as_view(), name="customer-signup"),

    # Login JWT
    path("companies/login/", CompanyTokenObtainPairView.as_view(), name="company-login"),
    path("customers/login/", CustomerTokenObtainPairView.as_view(), name="customer-login"),

    # Refresh JWT
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
]