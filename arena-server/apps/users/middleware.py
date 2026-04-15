from django.utils import timezone
from .models import Company, Customer

class LastActivityMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if request.user.is_authenticated:
            # We use update() to avoid triggering signals or full save() logic for performance
            now = timezone.now()
            if hasattr(request.user, 'name'): # Company
                Company.objects.filter(id=request.user.id).update(last_activity=now)
            elif hasattr(request.user, 'full_name'): # Customer
                Customer.objects.filter(id=request.user.id).update(last_activity=now)
        
        response = self.get_response(request)
        return response
