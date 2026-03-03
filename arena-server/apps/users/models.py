from django.db import models

class Company(models.Model):

    CONTRIBUTION_CHOICES = [
        ("shop", "Shop"),
        ("service", "Professional Service"),
        ("entertainment", "Entertainment & Events"),
        ("education", "Education / Training"),
        ("restauration", "Restaurant / Food"),
        ("art-culture", "Art & Culture"),
        ("health", "Health & Wellness"),
        ("other", "Other"),
    ]

    name = models.CharField(max_length=255)
    phone_number = models.CharField(max_length=20)
    contribution_type = models.CharField(
        max_length=50,
        choices=CONTRIBUTION_CHOICES
    )
    website = models.URLField(blank=True)
    description = models.TextField()
    password = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name