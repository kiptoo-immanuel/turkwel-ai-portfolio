from rest_framework import serializers
from django.contrib.auth.models import User
from .models import TeamMember, AIAgent, AgentPricing, Model3D, VisitorAnalytics

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']


class TeamMemberSerializer(serializers.ModelSerializer):
    profilePdf = serializers.SerializerMethodField()
    profileImage = serializers.CharField(source='profile_image', required=False)
    isPublished = serializers.BooleanField(source='is_published', required=False)

    class Meta:
        model = TeamMember
        fields = [
            'id', 'name', 'position', 'biography', 'email', 'phone',
            'linkedin', 'website', 'profileImage', 'profilePdf',
            'skills', 'qualifications', 'isPublished', 'created_at'
        ]

    def get_profilePdf(self, obj):
        if obj.profile_pdf:
            return {
                'url': obj.profile_pdf,
                'fileName': obj.profile_pdf_name or 'Profile.pdf'
            }
        return None


class AgentPricingSerializer(serializers.ModelSerializer):
    planName = serializers.CharField(source='plan_name')
    billingType = serializers.CharField(source='billing_type')

    class Meta:
        model = AgentPricing
        fields = ['id', 'ai_agent', 'planName', 'price', 'currency', 'billingType', 'created_at']


class AIAgentSerializer(serializers.ModelSerializer):
    plans = AgentPricingSerializer(many=True, read_only=True)
    shortDescription = serializers.CharField(source='short_description')
    fullDescription = serializers.CharField(source='full_description', required=False, allow_blank=True)
    demoUrl = serializers.CharField(source='demo_url', required=False, allow_blank=True)
    documentationUrl = serializers.CharField(source='documentation_url', required=False, allow_blank=True)
    purchaseUrl = serializers.CharField(source='purchase_url', required=False, allow_blank=True)
    status = serializers.SerializerMethodField()

    class Meta:
        model = AIAgent
        fields = [
            'id', 'name', 'shortDescription', 'fullDescription', 'category',
            'features', 'benefits', 'image', 'demoUrl', 'documentationUrl',
            'purchaseUrl', 'status', 'plans', 'created_at'
        ]

    def get_status(self, obj):
        return {
            'published': obj.published,
            'available': obj.available
        }


class Model3DSerializer(serializers.ModelSerializer):
    shortDescription = serializers.CharField(source='short_description', required=False, allow_blank=True)
    fullDescription = serializers.CharField(source='full_description', required=False, allow_blank=True)
    sourceFile = serializers.SerializerMethodField()
    convertedFile = serializers.SerializerMethodField()
    thumbnail = serializers.SerializerMethodField()
    conversionStatus = serializers.CharField(source='conversion_status')
    conversionError = serializers.CharField(source='conversion_error', required=False, allow_null=True)
    isPublished = serializers.BooleanField(source='is_published')
    isFeatured = serializers.BooleanField(source='is_featured')
    viewsCount = serializers.IntegerField(source='views_count')

    class Meta:
        model = Model3D
        fields = [
            'id', 'title', 'shortDescription', 'fullDescription', 'category',
            'tags', 'sourceFile', 'convertedFile', 'thumbnail', 'conversionStatus',
            'conversionError', 'isPublished', 'isFeatured', 'viewsCount', 'created_at'
        ]

    def get_sourceFile(self, obj):
        return {
            'url': obj.source_file_url,
            'fileName': obj.source_file_name,
            'format': obj.source_file_format,
        }

    def get_convertedFile(self, obj):
        if obj.converted_file_url:
            return {
                'url': obj.converted_file_url,
                'fileName': f"{obj.title.lower().replace(' ', '_')}.glb",
                'format': 'glb',
            }
        return None

    def get_thumbnail(self, obj):
        return {'url': obj.thumbnail_url or '/assets/hero_building.jpg'}


class VisitorAnalyticsSerializer(serializers.ModelSerializer):
    class Meta:
        model = VisitorAnalytics
        fields = ['id', 'page', 'session_id', 'referrer', 'is_unique_visit', 'user_agent', 'timestamp']
