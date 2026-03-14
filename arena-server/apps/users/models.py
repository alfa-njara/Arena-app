from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin

# ----------------------------
# User Manager
# ----------------------------
class UserManager(BaseUserManager):
    def create_user(self, phone_number, password=None, **extra_fields):
        if not phone_number:
            raise ValueError("Phone number is required")
        user = self.model(phone_number=phone_number, **extra_fields)
        user.set_password(password)  # hashage automatique
        user.save(using=self._db)
        return user

    def create_superuser(self, phone_number, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        return self.create_user(phone_number, password, **extra_fields)

# ----------------------------
# Company Model
# ----------------------------
class Company(AbstractBaseUser, PermissionsMixin):
    name = models.CharField(max_length=255)
    phone_number = models.CharField(max_length=20, unique=True)
    contribution_type = models.CharField(max_length=50, blank=True)
    website = models.URLField(blank=True)
    description = models.CharField(max_length=500, blank=True)
    location = models.CharField(max_length=255, blank=True, null=True)
    logo_url = models.URLField(blank=True, null=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    # Fix conflits permissions
    groups = models.ManyToManyField(
        'auth.Group',
        related_name='company_set',
        blank=True,
        help_text='The groups this user belongs to.',
        verbose_name='groups'
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='company_set_permissions',
        blank=True,
        help_text='Specific permissions for this user.',
        verbose_name='user permissions'
    )

    USERNAME_FIELD = "phone_number"
    REQUIRED_FIELDS = ["name"]

    objects = UserManager()

    def save(self, *args, **kwargs):
        if self.phone_number:
            self.phone_number = self.phone_number.replace(" ", "")
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name

# ----------------------------
# Customer Model
# ----------------------------
class Customer(AbstractBaseUser, PermissionsMixin):
    full_name = models.CharField(max_length=255)
    phone_number = models.CharField(max_length=20, unique=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    # Fix conflits permissions
    groups = models.ManyToManyField(
        'auth.Group',
        related_name='customer_set',
        blank=True,
        help_text='The groups this user belongs to.',
        verbose_name='groups'
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='customer_set_permissions',
        blank=True,
        help_text='Specific permissions for this user.',
        verbose_name='user permissions'
    )

    USERNAME_FIELD = "phone_number"
    REQUIRED_FIELDS = ["full_name"]

    objects = UserManager()

    def save(self, *args, **kwargs):
        if self.phone_number:
            self.phone_number = self.phone_number.replace(" ", "")
        super().save(*args, **kwargs)

    def __str__(self):
        return self.full_name

# ----------------------------
# Favorite Model
# ----------------------------
class Favorite(models.Model):
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name="favorites")
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name="favorited_by")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('customer', 'company')

    def __str__(self):
        return f"{self.customer.full_name} -> {self.company.name}"