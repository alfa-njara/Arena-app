from rest_framework import serializers
from .models import Company, Customer, Favorite
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

# --- Company ---
class CompanySerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = Company
        fields = ["id", "name", "phone_number", "contribution_type", "website", "description", "location", "logo_url", "password"]

    def create(self, validated_data):
        password = validated_data.pop("password")
        company = Company(**validated_data)
        company.set_password(password)
        company.save()
        return company

class CompanyTokenObtainPairSerializer(serializers.Serializer):
    phone_number = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        phone_number = attrs.get("phone_number")
        password = attrs.get("password")

        try:
            user = Company.objects.get(phone_number=phone_number)
        except Company.DoesNotExist:
            raise serializers.ValidationError("No active account found with the given credentials")

        if not user.check_password(password):
            raise serializers.ValidationError("No active account found with the given credentials")

        if not user.is_active:
            raise serializers.ValidationError("User account is disabled.")

        from rest_framework_simplejwt.tokens import RefreshToken
        refresh = RefreshToken.for_user(user)
        refresh["name"] = user.name
        refresh["user_type"] = "company"

        return {
            "refresh": str(refresh),
            "access": str(refresh.access_token),
            "name": user.name,
            "user_type": "company",
        }

# --- Customer ---
class CustomerSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = Customer
        fields = ["id", "full_name", "phone_number", "password"]

    def create(self, validated_data):
        password = validated_data.pop("password")
        customer = Customer(**validated_data)
        customer.set_password(password)
        customer.save()
        return customer

class CustomerTokenObtainPairSerializer(serializers.Serializer):
    phone_number = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        phone_number = attrs.get("phone_number")
        password = attrs.get("password")

        try:
            user = Customer.objects.get(phone_number=phone_number)
        except Customer.DoesNotExist:
            raise serializers.ValidationError("No active account found with the given credentials")

        if not user.check_password(password):
            raise serializers.ValidationError("No active account found with the given credentials")

        if not user.is_active:
            raise serializers.ValidationError("User account is disabled.")

        from rest_framework_simplejwt.tokens import RefreshToken
        refresh = RefreshToken.for_user(user)
        refresh["full_name"] = user.full_name
        refresh["user_type"] = "customer"

        return {
            "refresh": str(refresh),
            "access": str(refresh.access_token),
            "full_name": user.full_name,
            "user_type": "customer",
        }

# --- Favorite ---
class FavoriteSerializer(serializers.ModelSerializer):
    company_details = CompanySerializer(source='company', read_only=True)

    class Meta:
        model = Favorite
        fields = ["id", "customer", "company", "company_details", "created_at"]
        read_only_fields = ["customer"]