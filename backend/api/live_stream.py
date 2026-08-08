import json
import time
import threading
from queue import Queue, Empty
from django.utils import timezone
from datetime import datetime, timedelta

class VisitorStreamBroadcaster:
    """
    Thread-safe Real-Time Server-Sent Events (SSE) Broadcaster in Python.
    Broadcasts live visitor events to connected Admin Portal clients and handles midnight day resets.
    """
    def __init__(self):
        self.listeners = []
        self.lock = threading.Lock()

    def add_listener(self):
        q = Queue(maxsize=100)
        with self.lock:
            self.listeners.append(q)
        return q

    def remove_listener(self, q):
        with self.lock:
            if q in self.listeners:
                self.listeners.remove(q)

    def broadcast(self, event_type, data):
        message = {
            'event': event_type,
            'data': data,
            'timestamp': timezone.now().isoformat()
        }
        with self.lock:
            dead = []
            for q in self.listeners:
                try:
                    q.put_nowait(message)
                except Exception:
                    dead.append(q)
            for q in dead:
                if q in self.listeners:
                    self.listeners.remove(q)

broadcaster = VisitorStreamBroadcaster()


def get_latest_dashboard_stats():
    """
    Calculates live dashboard metrics strictly from Python ORM queries.
    Automatically resets daily count at midnight.
    """
    from .models import TeamMember, AIAgent, Model3D, VisitorAnalytics
    from django.db.models import Count

    now = timezone.now()
    start_of_day = now.replace(hour=0, minute=0, second=0, microsecond=0)
    start_of_week = start_of_day - timedelta(days=now.weekday())
    start_of_month = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)

    total_visitors = VisitorAnalytics.objects.count()
    visitors_today = VisitorAnalytics.objects.filter(timestamp__gte=start_of_day).count()
    visitors_week = VisitorAnalytics.objects.filter(timestamp__gte=start_of_week).count()
    visitors_month = VisitorAnalytics.objects.filter(timestamp__gte=start_of_month).count()

    total_team = TeamMember.objects.count()

    total_agents = AIAgent.objects.count()
    available_agents = AIAgent.objects.filter(available=True).count()
    unavailable_agents = AIAgent.objects.filter(available=False).count()

    total_models = Model3D.objects.count()
    product_models = Model3D.objects.filter(category='Product').count()
    mep_models = Model3D.objects.filter(category='MEP').count()
    structural_models = Model3D.objects.filter(category='Structural').count()
    processing_models = Model3D.objects.filter(conversion_status='processing').count()
    ready_models = Model3D.objects.filter(conversion_status='ready').count()
    failed_models = Model3D.objects.filter(conversion_status='failed').count()

    # Dynamic 7-day traffic trend
    traffic_trend = []
    for i in range(6, -1, -1):
        day_date = (now - timedelta(days=i)).date()
        day_label = 'Today' if i == 0 else day_date.strftime('%b %d')
        day_start = timezone.make_aware(datetime.combine(day_date, datetime.min.time()))
        day_end = timezone.make_aware(datetime.combine(day_date, datetime.max.time()))

        day_total = VisitorAnalytics.objects.filter(timestamp__range=(day_start, day_end)).count()
        day_unique = VisitorAnalytics.objects.filter(timestamp__range=(day_start, day_end), is_unique_visit=True).count()

        traffic_trend.append({
            '_id': day_label,
            'totalViews': day_total,
            'uniqueVisits': day_unique,
        })

    # Dynamic Top Pages
    top_pages_qs = (
        VisitorAnalytics.objects.values('page')
        .annotate(count=Count('id'))
        .order_by('-count')[:5]
    )
    top_pages = [{'_id': item['page'], 'count': item['count']} for item in top_pages_qs]

    return {
        'visitors': {
            'total': total_visitors,
            'today': visitors_today,
            'week': visitors_week,
            'month': visitors_month,
        },
        'team': {'total': total_team},
        'agents': {
            'total': total_agents,
            'available': available_agents,
            'unavailable': unavailable_agents,
        },
        'models3d': {
            'total': total_models,
            'product': product_models,
            'mep': mep_models,
            'structural': structural_models,
            'processing': processing_models,
            'ready': ready_models,
            'failed': failed_models,
        },
        'topPages': top_pages,
        'trafficTrend': traffic_trend,
        'lastUpdated': now.strftime('%H:%M:%S UTC'),
    }
