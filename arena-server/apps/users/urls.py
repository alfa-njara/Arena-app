from django.urls import path
from .views import (
    CompanyCreateView, CustomerCreateView,
    CompanyTokenObtainPairView, CustomerTokenObtainPairView,
    CompanyListView, CompanyProfileView, CompanyStatsView,
    FavoriteListCreateView, FavoriteDeleteView
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

    # Company endpoints
    path("companies/list/", CompanyListView.as_view(), name="company-list"),
    path("companies/me/", CompanyProfileView.as_view(), name="company-me"),
    path("companies/stats/", CompanyStatsView.as_view(), name="company-stats"),

    # Favorites endpoints
    path("customers/favorites/", FavoriteListCreateView.as_view(), name="favorite-list-create"),
    path("customers/favorites/<int:company_id>/", FavoriteDeleteView.as_view(), name="favorite-delete"),
]