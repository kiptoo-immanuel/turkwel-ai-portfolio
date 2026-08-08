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
    Calculates live dashboard metrics strictly from Python ORM queries and MongoDB.
    - All-time page views and unique visitors NEVER reset.
    - Period metrics (today, week, month) reset automatically per time window.
    """
    from .models import TeamMember, AIAgent, Model3D, VisitorAnalytics, GlobalAnalyticsCounter
    from .db_mongo import get_mongo_db
    from django.db.models import Count
    from django.utils import timezone
    from datetime import datetime, timedelta

    now = timezone.now()
    start_of_day = now.replace(hour=0, minute=0, second=0, microsecond=0)
    start_of_week = start_of_day - timedelta(days=now.weekday())
    start_of_month = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)

    # 1. Fetch or initialize persistent All-Time Counter (NEVER RESETS)
    counter, _ = GlobalAnalyticsCounter.objects.get_or_create(id=1)
    
    # Sync with actual VisitorAnalytics DB total if table has more records
    total_db_records = VisitorAnalytics.objects.count()
    if total_db_records > counter.all_time_page_views:
        counter.all_time_page_views = total_db_records
        counter.all_time_unique_visitors = VisitorAnalytics.objects.values('session_id').distinct().count()
        counter.save()

    all_time_views = counter.all_time_page_views
    all_time_uniques = counter.all_time_unique_visitors

    # 2. Period Visitor Analytics (resets automatically at start of day/week/month)
    today_views = VisitorAnalytics.objects.filter(timestamp__gte=start_of_day).count()
    today_uniques = VisitorAnalytics.objects.filter(timestamp__gte=start_of_day, is_unique_visit=True).count()

    week_views = VisitorAnalytics.objects.filter(timestamp__gte=start_of_week).count()
    week_uniques = VisitorAnalytics.objects.filter(timestamp__gte=start_of_week, is_unique_visit=True).count()

    month_views = VisitorAnalytics.objects.filter(timestamp__gte=start_of_month).count()
    month_uniques = VisitorAnalytics.objects.filter(timestamp__gte=start_of_month, is_unique_visit=True).count()

    # 3. Dynamic 7-day traffic trend (0 if no visitors yet)
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

    # 4. Inventory Metrics
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

    # 5. Top Pages
    top_pages_qs = (
        VisitorAnalytics.objects.values('page')
        .annotate(count=Count('id'))
        .order_by('-count')[:5]
    )
    top_pages = [{'_id': item['page'], 'count': item['count']} for item in top_pages_qs]

    # MongoDB Sync if connected
    mongo_db = get_mongo_db()
    if mongo_db is not None:
        try:
            mongo_db['global_analytics'].update_one(
                {'_id': 'all_time'},
                {'$set': {
                    'all_time_page_views': all_time_views,
                    'all_time_unique_visitors': all_time_uniques,
                    'last_updated': now.isoformat()
                }},
                upsert=True
            )
        except Exception:
            pass

    return {
        'visitors': {
            'allTimeViews': all_time_views,
            'allTimeUniques': all_time_uniques,
            'total': all_time_views,
            'today': today_views,
            'todayUnique': today_uniques,
            'week': week_views,
            'weekUnique': week_uniques,
            'month': month_views,
            'monthUnique': month_uniques,
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

