from django.db import models
from django.contrib.auth.models import User

class TeamMember(models.Model):
    name = models.CharField(max_length=255)
    position = models.CharField(max_length=255)
    biography = models.TextField()
    email = models.EmailField(blank=True, default='')
    phone = models.CharField(max_length=50, blank=True, default='')
    linkedin = models.URLField(blank=True, default='')
    website = models.URLField(blank=True, default='')
    profile_image = models.CharField(max_length=500, blank=True, default='/assets/team-placeholder.jpg')
    profile_pdf = models.CharField(max_length=500, blank=True, null=True)
    profile_pdf_name = models.CharField(max_length=255, blank=True, null=True)
    skills = models.JSONField(default=list, blank=True)
    qualifications = models.JSONField(default=list, blank=True)
    is_published = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - {self.position}"


class AIAgent(models.Model):
    name = models.CharField(max_length=255)
    short_description = models.CharField(max_length=500)
    full_description = models.TextField(blank=True, default='')
    category = models.CharField(max_length=100, default='built-environment')
    features = models.JSONField(default=list, blank=True)
    benefits = models.JSONField(default=list, blank=True)
    image = models.CharField(max_length=500, blank=True, default='/assets/hvac_bim.jpg')
    demo_url = models.URLField(blank=True, default='')
    documentation_url = models.URLField(blank=True, default='')
    purchase_url = models.URLField(blank=True, default='')
    published = models.BooleanField(default=True)
    available = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class AgentPricing(models.Model):
    BILLING_CHOICES = [
        ('free', 'Free'),
        ('one_time', 'One-time Purchase'),
        ('monthly', 'Monthly Subscription'),
        ('annual', 'Annual Subscription'),
        ('custom', 'Custom Pricing'),
    ]

    ai_agent = models.ForeignKey(AIAgent, related_name='plans', on_delete=models.CASCADE)
    plan_name = models.CharField(max_length=255)
    price = models.FloatField(default=0.0)
    currency = models.CharField(max_length=10, default='USD')
    billing_type = models.CharField(max_length=50, choices=BILLING_CHOICES, default='one_time')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.plan_name} - ${self.price} ({self.billing_type})"


class Model3D(models.Model):
    CATEGORY_CHOICES = [
        ('Product', 'Product Engineering'),
        ('MEP', 'MEP & HVAC Systems'),
        ('Structural', 'Structural Steel & Concrete'),
    ]

    STATUS_CHOICES = [
        ('uploaded', 'Uploaded'),
        ('processing', 'Processing'),
        ('ready', 'Ready'),
        ('failed', 'Failed'),
    ]

    title = models.CharField(max_length=255)
    short_description = models.CharField(max_length=500, blank=True, default='')
    full_description = models.TextField(blank=True, default='')
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='MEP')
    tags = models.JSONField(default=list, blank=True)
    source_file_url = models.CharField(max_length=500)
    source_file_name = models.CharField(max_length=255)
    source_file_format = models.CharField(max_length=50)
    converted_file_url = models.CharField(max_length=500, blank=True, default='')
    thumbnail_url = models.CharField(max_length=500, blank=True, default='/assets/hero_building.jpg')
    conversion_status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='uploaded')
    conversion_error = models.TextField(blank=True, null=True)
    is_published = models.BooleanField(default=True)
    is_featured = models.BooleanField(default=False)
    views_count = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} ({self.category})"


class VisitorAnalytics(models.Model):
    page = models.CharField(max_length=255, default='/')
    session_id = models.CharField(max_length=255)
    referrer = models.CharField(max_length=500, default='direct')
    is_unique_visit = models.BooleanField(default=True)
    user_agent = models.TextField(blank=True, default='')
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.page} - {self.session_id} - {self.timestamp}"
