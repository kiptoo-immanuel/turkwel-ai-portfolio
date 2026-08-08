from django.urls import path
from .views import (
    AdminLoginView, AdminLogoutView, AdminMeView,
    TeamPublicView, TeamAdminAllView, TeamAdminDetailView,
    AgentPublicView, AgentAdminAllView, AgentAdminDetailView, AgentPricingAdminView,
    GalleryPublicView, GalleryPublicViewIncrement, GalleryAdminAllView, GalleryAdminDetailView, GalleryAdminConvertView,
    VisitorAnalyticsTrackView, DashboardStatsView, VisitorLiveStreamView, AnalyticsResetView,
    CaseStudyPublicView, CaseStudyAdminAllView, CaseStudyAdminDetailView
)

urlpatterns = [
    # Auth
    path('admin/auth/login', AdminLoginView.as_view(), name='admin-login'),
    path('admin/auth/login/', AdminLoginView.as_view(), name='admin-login-slash'),
    path('admin/auth/logout', AdminLogoutView.as_view(), name='admin-logout'),
    path('admin/auth/me', AdminMeView.as_view(), name='admin-me'),
    path('admin/auth/me/', AdminMeView.as_view(), name='admin-me-slash'),

    # Team
    path('team/public', TeamPublicView.as_view(), name='team-public'),
    path('team/public/', TeamPublicView.as_view(), name='team-public-slash'),
    path('team/admin/all', TeamAdminAllView.as_view(), name='team-admin-all'),
    path('team/admin/all/', TeamAdminAllView.as_view(), name='team-admin-all-slash'),
    path('team/admin', TeamAdminAllView.as_view(), name='team-admin-create'),
    path('team/admin/', TeamAdminAllView.as_view(), name='team-admin-create-slash'),
    path('team/admin/<int:pk>', TeamAdminDetailView.as_view(), name='team-admin-detail'),
    path('team/admin/<int:pk>/', TeamAdminDetailView.as_view(), name='team-admin-detail-slash'),

    # Agents
    path('agents/public', AgentPublicView.as_view(), name='agent-public'),
    path('agents/public/', AgentPublicView.as_view(), name='agent-public-slash'),
    path('agents/admin/all', AgentAdminAllView.as_view(), name='agent-admin-all'),
    path('agents/admin/all/', AgentAdminAllView.as_view(), name='agent-admin-all-slash'),
    path('agents/admin', AgentAdminAllView.as_view(), name='agent-admin-create'),
    path('agents/admin/', AgentAdminAllView.as_view(), name='agent-admin-create-slash'),
    path('agents/admin/<int:pk>', AgentAdminDetailView.as_view(), name='agent-admin-detail'),
    path('agents/admin/<int:pk>/', AgentAdminDetailView.as_view(), name='agent-admin-detail-slash'),
    path('agents/admin/<int:pk>/pricing', AgentPricingAdminView.as_view(), name='agent-pricing-add'),
    path('agents/admin/<int:pk>/pricing/', AgentPricingAdminView.as_view(), name='agent-pricing-add-slash'),
    path('agents/admin/pricing/<int:plan_id>', AgentPricingAdminView.as_view(), name='agent-pricing-delete'),
    path('agents/admin/pricing/<int:plan_id>/', AgentPricingAdminView.as_view(), name='agent-pricing-delete-slash'),

    # 3D Gallery
    path('gallery/public', GalleryPublicView.as_view(), name='gallery-public'),
    path('gallery/public/', GalleryPublicView.as_view(), name='gallery-public-slash'),
    path('gallery/public/<int:pk>/view', GalleryPublicViewIncrement.as_view(), name='gallery-view'),
    path('gallery/public/<int:pk>/view/', GalleryPublicViewIncrement.as_view(), name='gallery-view-slash'),
    path('gallery/admin/all', GalleryAdminAllView.as_view(), name='gallery-admin-all'),
    path('gallery/admin/all/', GalleryAdminAllView.as_view(), name='gallery-admin-all-slash'),
    path('gallery/admin', GalleryAdminAllView.as_view(), name='gallery-admin-create'),
    path('gallery/admin/', GalleryAdminAllView.as_view(), name='gallery-admin-create-slash'),
    path('gallery/admin/<int:pk>', GalleryAdminDetailView.as_view(), name='gallery-admin-detail'),
    path('gallery/admin/<int:pk>/', GalleryAdminDetailView.as_view(), name='gallery-admin-detail-slash'),
    path('gallery/admin/<int:pk>/convert', GalleryAdminConvertView.as_view(), name='gallery-admin-convert'),
    path('gallery/admin/<int:pk>/convert/', GalleryAdminConvertView.as_view(), name='gallery-admin-convert-slash'),

    # Analytics & Live Stream
    path('analytics/track', VisitorAnalyticsTrackView.as_view(), name='analytics-track'),
    path('analytics/track/', VisitorAnalyticsTrackView.as_view(), name='analytics-track-slash'),
    path('analytics/admin/stats', DashboardStatsView.as_view(), name='analytics-stats'),
    path('analytics/admin/stats/', DashboardStatsView.as_view(), name='analytics-stats-slash'),
    path('analytics/admin/live-stream', VisitorLiveStreamView.as_view(), name='analytics-live-stream'),
    path('analytics/admin/live-stream/', VisitorLiveStreamView.as_view(), name='analytics-live-stream-slash'),
    path('analytics/admin/reset', AnalyticsResetView.as_view(), name='analytics-reset'),
    path('analytics/admin/reset/', AnalyticsResetView.as_view(), name='analytics-reset-slash'),

    # Proven Performance Metrics / Case Studies
    path('metrics/public', CaseStudyPublicView.as_view(), name='metrics-public'),
    path('metrics/public/', CaseStudyPublicView.as_view(), name='metrics-public-slash'),
    path('metrics/admin/all', CaseStudyAdminAllView.as_view(), name='metrics-admin-all'),
    path('metrics/admin/all/', CaseStudyAdminAllView.as_view(), name='metrics-admin-all-slash'),
    path('metrics/admin', CaseStudyAdminAllView.as_view(), name='metrics-admin-create'),
    path('metrics/admin/', CaseStudyAdminAllView.as_view(), name='metrics-admin-create-slash'),
    path('metrics/admin/<int:pk>', CaseStudyAdminDetailView.as_view(), name='metrics-admin-detail'),
    path('metrics/admin/<int:pk>/', CaseStudyAdminDetailView.as_view(), name='metrics-admin-detail-slash'),
]
