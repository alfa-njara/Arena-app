from django.urls import path
from .views import (
    CompanyCreateView, CustomerCreateView,
    CompanyTokenObtainPairView, CustomerTokenObtainPairView,
    CompanyListView, CompanyProfileView, CompanyStatsView,
    FavoriteListCreateView, FavoriteDeleteView, CompanyVisitCreateView,
    AdminStatsView, AdminCompanyListView, AdminCustomerListView, AdminUserActionView
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
    path("companies/<int:company_id>/visit/", CompanyVisitCreateView.as_view(), name="company-visit"),

    # Favorites endpoints
    path("favorites/", FavoriteListCreateView.as_view(), name="favorite-list-create"),
    path("favorites/<int:company_id>/", FavoriteDeleteView.as_view(), name="favorite-delete"),
    # Admin endpoints
    path("admin/stats/", AdminStatsView.as_view(), name="admin-stats"),
    path("admin/companies/", AdminCompanyListView.as_view(), name="admin-companies"),
    path("admin/customers/", AdminCustomerListView.as_view(), name="admin-customers"),
    path("admin/user-action/", AdminUserActionView.as_view(), name="admin-user-action"),
]