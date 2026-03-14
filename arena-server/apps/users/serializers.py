from rest_framework import serializers
from .models import Company, Customer
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

# --- Company ---
class CompanySerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = Company
        fields = ["id", "name", "phone_number", "contribution_type", "website", "description", "password"]

    def create(self, validated_data):
        password = validated_data.pop("password")
        company = Company(**validated_data)
        company.set_password(password)
        company.save()
        return company

class CompanyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token["name"] = user.name
        return token

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

class CustomerTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token["full_name"] = user.full_name
        return token