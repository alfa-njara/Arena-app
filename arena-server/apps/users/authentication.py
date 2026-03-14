from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import AuthenticationFailed
from django.utils.translation import gettext_lazy as _
from .models import Company, Customer

class CustomJWTAuthentication(JWTAuthentication):
    def get_user(self, validated_token):
        try:
            user_id = validated_token[self.user_id_claim]
        except KeyError:
            raise AuthenticationFailed(_("Token contained no recognizable user identification"))

        user_type = validated_token.get("user_type")

        if user_type == "company":
            try:
                user = Company.objects.get(**{self.user_id_field: user_id})
            except Company.DoesNotExist:
                raise AuthenticationFailed(_("User not found"), code="user_not_found")
        elif user_type == "customer":
            try:
                user = Customer.objects.get(**{self.user_id_field: user_id})
            except Customer.DoesNotExist:
                raise AuthenticationFailed(_("User not found"), code="user_not_found")
        else:
            raise AuthenticationFailed(_("Invalid user type in token"), code="invalid_user_type")

        if not user.is_active:
            raise AuthenticationFailed(_("User is inactive"), code="user_inactive")

        return user
