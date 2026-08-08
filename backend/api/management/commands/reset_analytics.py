from django.core.management.base import BaseCommand
from api.models import VisitorAnalytics, Model3D
from api.live_stream import broadcaster, get_latest_dashboard_stats

class Command(BaseCommand):
    help = 'Resets all pageviews and visitor analytics records in Django database to 0'

    def handle(self, *args, **kwargs):
        count, _ = VisitorAnalytics.objects.all().delete()
        Model3D.objects.all().update(views_count=0)

        # Broadcast update to connected admin portals
        try:
            latest = get_latest_dashboard_stats()
            broadcaster.broadcast('visitor_update', latest)
        except Exception:
            pass

        self.stdout.write(self.style.SUCCESS(f'[Django Analytics Reset] Successfully deleted {count} visitor records. All pageviews reset to 0.'))
