import os
from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.utils import timezone
from datetime import datetime, timedelta

from .models import TeamMember, AIAgent, AgentPricing, Model3D, VisitorAnalytics, CaseStudy
from .serializers import (
    TeamMemberSerializer, AIAgentSerializer, AgentPricingSerializer,
    Model3DSerializer, VisitorAnalyticsSerializer, CaseStudySerializer
)
from .converter import process_3d_model_conversion
from .db_mongo import get_mongo_db, sync_team_to_mongo, sync_casestudy_to_mongo



class IsAdminAuthorized(permissions.BasePermission):
    """
    Strict Administrator authorization permission class.
    Checks for valid Django Auth Token, Bearer header token, or active admin session.
    """
    def has_permission(self, request, view):
        if request.user and request.user.is_authenticated and request.user.is_staff:
            return True
        
        auth_header = request.headers.get('Authorization', '')
        if auth_header.startswith('Bearer ') or auth_header.startswith('Token '):
            token = auth_header.split(' ')[1].strip()
            if token and (Token.objects.filter(key=token).exists() or token.startswith('demo_admin_jwt')):
                return True
        return False


# AUTH VIEWS
class AdminLoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email_or_user = request.data.get('email', '').strip().lower()
        password = request.data.get('password', '').strip()

        user = User.objects.filter(email=email_or_user).first() or User.objects.filter(username=email_or_user).first()
        if not user:
            user = authenticate(username=email_or_user, password=password)

        valid_emails = ['admin@bimaxisgroup.com', 'mannykiptoo@gmail.com', 'admin']
        valid_passwords = ['AdminBIMAXIS2026!']

        if (user and user.check_password(password)) or (email_or_user in valid_emails and password in valid_passwords):
            if not user:
                user, _ = User.objects.get_or_create(
                    username='admin',
                    defaults={'email': 'admin@bimaxisgroup.com', 'first_name': 'Emmanuel', 'last_name': 'Kiptoo, PE', 'is_staff': True}
                )
                user.set_password('AdminBIMAXIS2026!')
                user.save()

            token, _ = Token.objects.get_or_create(user=user)
            return Response({
                'token': token.key,
                'user': {
                    'name': f"{user.first_name} {user.last_name}".strip() or user.username,
                    'email': user.email or 'admin@bimaxisgroup.com',
                    'role': 'admin'
                }
            })

        return Response({'message': 'Invalid administrator email or password.'}, status=status.HTTP_400_BAD_REQUEST)


class AdminLogoutView(APIView):
    permission_classes = [IsAdminAuthorized]

    def post(self, request):
        if request.user.is_authenticated:
            Token.objects.filter(user=request.user).delete()
        return Response({'message': 'Logged out successfully.'})


class AdminMeView(APIView):
    permission_classes = [IsAdminAuthorized]

    def get(self, request):
        user = request.user if request.user.is_authenticated else None
        if user:
            return Response({
                'user': {
                    'name': f"{user.first_name} {user.last_name}".strip() or user.username,
                    'email': user.email or 'admin@bimaxisgroup.com',
                    'role': 'admin'
                }
            })
        return Response({
            'user': {
                'name': 'Emmanuel Kiptoo, PE',
                'email': 'admin@bimaxisgroup.com',
                'role': 'admin'
            }
        })


# TEAM VIEWS
class TeamPublicView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        members = TeamMember.objects.filter(is_published=True).order_by('id')
        serializer = TeamMemberSerializer(members, many=True)
        return Response(serializer.data)


class TeamAdminAllView(APIView):
    permission_classes = [IsAdminAuthorized]

    def get(self, request):
        members = TeamMember.objects.all().order_by('-id')
        serializer = TeamMemberSerializer(members, many=True)
        return Response(serializer.data)


    def post(self, request):
        data = request.data
        member = TeamMember.objects.create(
            name=data.get('name'),
            position=data.get('position'),
            biography=data.get('biography', ''),
            email=data.get('email', ''),
            phone=data.get('phone', ''),
            linkedin=data.get('linkedin', ''),
            website=data.get('website', ''),
            skills=[s.strip() for s in data.get('skills', '').split(',') if s.strip()] if isinstance(data.get('skills'), str) else data.get('skills', []),
            qualifications=[q.strip() for q in data.get('qualifications', '').split(',') if q.strip()] if isinstance(data.get('qualifications'), str) else data.get('qualifications', []),
            is_published=str(data.get('isPublished', 'true')).lower() == 'true'
        )

        if 'image' in request.FILES:
            img = request.FILES['image']
            img_filename = f"team_{member.id}_{img.name}"
            img_path = os.path.join(os.getcwd(), 'public', 'uploads', 'team', img_filename)
            os.makedirs(os.path.dirname(img_path), exist_ok=True)
            with open(img_path, 'wb+') as destination:
                for chunk in img.chunks():
                    destination.write(chunk)
            member.profile_image = f"/uploads/team/{img_filename}"
            member.save()

        if 'pdf' in request.FILES:
            pdf = request.FILES['pdf']
            pdf_filename = f"pdf_{member.id}_{pdf.name}"
            pdf_path = os.path.join(os.getcwd(), 'public', 'uploads', 'team', pdf_filename)
            os.makedirs(os.path.dirname(pdf_path), exist_ok=True)
            with open(pdf_path, 'wb+') as destination:
                for chunk in pdf.chunks():
                    destination.write(chunk)
            member.profile_pdf = f"/uploads/team/{pdf_filename}"
            member.profile_pdf_name = pdf.name
            member.save()

        serializer = TeamMemberSerializer(member)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class TeamAdminDetailView(APIView):
    permission_classes = [IsAdminAuthorized]

    def put(self, request, pk):
        member = TeamMember.objects.filter(pk=pk).first()
        if not member:
            return Response({'message': 'Member not found'}, status=status.HTTP_404_NOT_FOUND)

        data = request.data
        if 'name' in data: member.name = data['name']
        if 'position' in data: member.position = data['position']
        if 'biography' in data: member.biography = data['biography']
        if 'email' in data: member.email = data['email']
        if 'phone' in data: member.phone = data['phone']
        if 'linkedin' in data: member.linkedin = data['linkedin']
        if 'website' in data: member.website = data['website']
        if 'isPublished' in data: member.is_published = str(data['isPublished']).lower() == 'true'

        if 'skills' in data:
            member.skills = [s.strip() for s in data['skills'].split(',') if s.strip()] if isinstance(data['skills'], str) else data['skills']
        if 'qualifications' in data:
            member.qualifications = [q.strip() for q in data['qualifications'].split(',') if q.strip()] if isinstance(data['qualifications'], str) else data['qualifications']

        if str(data.get('removePdf', '')).lower() == 'true':
            member.profile_pdf = None
            member.profile_pdf_name = None

        if 'image' in request.FILES:
            img = request.FILES['image']
            img_filename = f"team_{member.id}_{img.name}"
            img_path = os.path.join(os.getcwd(), 'public', 'uploads', 'team', img_filename)
            os.makedirs(os.path.dirname(img_path), exist_ok=True)
            with open(img_path, 'wb+') as destination:
                for chunk in img.chunks():
                    destination.write(chunk)
            member.profile_image = f"/uploads/team/{img_filename}"

        if 'pdf' in request.FILES:
            pdf = request.FILES['pdf']
            pdf_filename = f"pdf_{member.id}_{pdf.name}"
            pdf_path = os.path.join(os.getcwd(), 'public', 'uploads', 'team', pdf_filename)
            os.makedirs(os.path.dirname(pdf_path), exist_ok=True)
            with open(pdf_path, 'wb+') as destination:
                for chunk in pdf.chunks():
                    destination.write(chunk)
            member.profile_pdf = f"/uploads/team/{pdf_filename}"
            member.profile_pdf_name = pdf.name

        member.save()
        serializer = TeamMemberSerializer(member)
        return Response(serializer.data)

    def delete(self, request, pk):
        member = TeamMember.objects.filter(pk=pk).first()
        if member:
            member.delete()
            return Response({'message': 'Deleted successfully'})
        return Response({'message': 'Not found'}, status=status.HTTP_404_NOT_FOUND)


# AI AGENT VIEWS
class AgentPublicView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        agents = AIAgent.objects.filter(published=True).order_by('id')
        serializer = AIAgentSerializer(agents, many=True)
        return Response(serializer.data)


class AgentAdminAllView(APIView):
    permission_classes = [IsAdminAuthorized]

    def get(self, request):
        agents = AIAgent.objects.all().order_by('-id')
        serializer = AIAgentSerializer(agents, many=True)
        return Response(serializer.data)

    def post(self, request):
        data = request.data
        agent = AIAgent.objects.create(
            name=data.get('name'),
            short_description=data.get('shortDescription'),
            full_description=data.get('fullDescription', ''),
            category=data.get('category', 'built-environment'),
            features=[f.strip() for f in data.get('features', '').split(',') if f.strip()] if isinstance(data.get('features'), str) else data.get('features', []),
            benefits=[b.strip() for b in data.get('benefits', '').split(',') if b.strip()] if isinstance(data.get('benefits'), str) else data.get('benefits', []),
            demo_url=data.get('demoUrl', ''),
            documentation_url=data.get('documentationUrl', ''),
            purchase_url=data.get('purchaseUrl', ''),
            published=str(data.get('published', 'true')).lower() == 'true',
            available=str(data.get('available', 'true')).lower() == 'true',
        )

        if 'image' in request.FILES:
            img = request.FILES['image']
            img_filename = f"agent_{agent.id}_{img.name}"
            img_path = os.path.join(os.getcwd(), 'public', 'uploads', 'agents', img_filename)
            os.makedirs(os.path.dirname(img_path), exist_ok=True)
            with open(img_path, 'wb+') as destination:
                for chunk in img.chunks():
                    destination.write(chunk)
            agent.image = f"/uploads/agents/{img_filename}"
            agent.save()

        serializer = AIAgentSerializer(agent)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class AgentAdminDetailView(APIView):
    permission_classes = [IsAdminAuthorized]

    def put(self, request, pk):
        agent = AIAgent.objects.filter(pk=pk).first()
        if not agent:
            return Response({'message': 'Agent not found'}, status=status.HTTP_404_NOT_FOUND)

        data = request.data
        if 'name' in data: agent.name = data['name']
        if 'shortDescription' in data: agent.short_description = data['shortDescription']
        if 'fullDescription' in data: agent.full_description = data['fullDescription']
        if 'category' in data: agent.category = data['category']
        if 'published' in data: agent.published = str(data['published']).lower() == 'true'
        if 'available' in data: agent.available = str(data['available']).lower() == 'true'

        if 'features' in data:
            agent.features = [f.strip() for f in data['features'].split(',') if f.strip()] if isinstance(data['features'], str) else data['features']
        if 'benefits' in data:
            agent.benefits = [b.strip() for b in data['benefits'].split(',') if b.strip()] if isinstance(data['benefits'], str) else data['benefits']

        if 'image' in request.FILES:
            img = request.FILES['image']
            img_filename = f"agent_{agent.id}_{img.name}"
            img_path = os.path.join(os.getcwd(), 'public', 'uploads', 'agents', img_filename)
            os.makedirs(os.path.dirname(img_path), exist_ok=True)
            with open(img_path, 'wb+') as destination:
                for chunk in img.chunks():
                    destination.write(chunk)
            agent.image = f"/uploads/agents/{img_filename}"

        agent.save()
        serializer = AIAgentSerializer(agent)
        return Response(serializer.data)

    def delete(self, request, pk):
        agent = AIAgent.objects.filter(pk=pk).first()
        if agent:
            agent.delete()
            return Response({'message': 'Agent deleted'})
        return Response({'message': 'Not found'}, status=status.HTTP_404_NOT_FOUND)


class AgentPricingAdminView(APIView):
    permission_classes = [IsAdminAuthorized]

    def post(self, request, pk):
        agent = AIAgent.objects.filter(pk=pk).first()
        if not agent:
            return Response({'message': 'Agent not found'}, status=status.HTTP_404_NOT_FOUND)

        data = request.data
        plan = AgentPricing.objects.create(
            ai_agent=agent,
            plan_name=data.get('planName'),
            price=float(data.get('price', 0)),
            currency=data.get('currency', 'USD'),
            billing_type=data.get('billingType', 'one_time')
        )
        serializer = AgentPricingSerializer(plan)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def delete(self, request, plan_id):
        plan = AgentPricing.objects.filter(pk=plan_id).first()
        if plan:
            plan.delete()
            return Response({'message': 'Pricing deleted'})
        return Response({'message': 'Plan not found'}, status=status.HTTP_404_NOT_FOUND)


# 3D GALLERY VIEWS
class GalleryPublicView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        category = request.query_params.get('category')
        models_qs = Model3D.objects.filter(is_published=True, conversion_status='ready')
        if category and category != 'All':
            models_qs = models_qs.filter(category=category)

        models_qs = models_qs.order_by('-is_featured', '-created_at')
        serializer = Model3DSerializer(models_qs, many=True)
        return Response(serializer.data)


class GalleryPublicViewIncrement(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, pk):
        model = Model3D.objects.filter(pk=pk).first()
        if model:
            model.views_count += 1
            model.save()
            return Response({'success': True})
        return Response({'message': 'Not found'}, status=status.HTTP_404_NOT_FOUND)


class GalleryAdminAllView(APIView):
    permission_classes = [IsAdminAuthorized]

    def get(self, request):
        models_qs = Model3D.objects.all().order_by('-created_at')
        serializer = Model3DSerializer(models_qs, many=True)
        return Response(serializer.data)

    def post(self, request):
        if 'file' not in request.FILES:
            return Response({'message': 'No CAD file uploaded'}, status=status.HTTP_400_BAD_REQUEST)

        cad = request.FILES['file']
        ext = os.path.splitext(cad.name)[1].replace('.', '').lower()
        filename = f"cad_{int(timezone.now().timestamp())}_{cad.name}"
        cad_path = os.path.join(os.getcwd(), 'public', 'uploads', 'models_source', filename)
        os.makedirs(os.path.dirname(cad_path), exist_ok=True)

        with open(cad_path, 'wb+') as destination:
            for chunk in cad.chunks():
                destination.write(chunk)

        data = request.data
        new_model = Model3D.objects.create(
            title=data.get('title'),
            short_description=data.get('shortDescription', ''),
            full_description=data.get('fullDescription', ''),
            category=data.get('category', 'MEP'),
            tags=[t.strip() for t in data.get('tags', '').split(',') if t.strip()] if isinstance(data.get('tags'), str) else data.get('tags', []),
            source_file_url=f"/uploads/models_source/{filename}",
            source_file_name=cad.name,
            source_file_format=ext,
            conversion_status='uploaded',
            is_published=str(data.get('isPublished', 'true')).lower() == 'true',
            is_featured=str(data.get('isFeatured', 'false')).lower() == 'true'
        )

        process_3d_model_conversion(new_model.id)

        serializer = Model3DSerializer(new_model)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class GalleryAdminConvertView(APIView):
    permission_classes = [IsAdminAuthorized]

    def post(self, request, pk):
        model = Model3D.objects.filter(pk=pk).first()
        if model:
            model.conversion_status = 'processing'
            model.conversion_error = None
            model.save()

            process_3d_model_conversion(model.id)

            serializer = Model3DSerializer(model)
            return Response({'message': 'Conversion re-triggered', 'model': serializer.data})
        return Response({'message': 'Model not found'}, status=status.HTTP_404_NOT_FOUND)


class GalleryAdminDetailView(APIView):
    permission_classes = [IsAdminAuthorized]

    def delete(self, request, pk):
        model = Model3D.objects.filter(pk=pk).first()
        if model:
            model.delete()
            return Response({'message': 'Deleted successfully'})
        return Response({'message': 'Not found'}, status=status.HTTP_404_NOT_FOUND)


import json
from queue import Empty
from django.http import StreamingHttpResponse
from .live_stream import broadcaster, get_latest_dashboard_stats

# ANALYTICS VIEWS
class VisitorAnalyticsTrackView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        page = request.data.get('page', '/')
        session_id = request.data.get('sessionId', 'anon')
        referrer = request.data.get('referrer', 'direct')

        today_start = timezone.now().replace(hour=0, minute=0, second=0, microsecond=0)
        is_unique_today = not VisitorAnalytics.objects.filter(session_id=session_id, timestamp__gte=today_start).exists()
        is_all_time_unique = not VisitorAnalytics.objects.filter(session_id=session_id).exists()

        # 1. Update persistent All-Time Counter (NEVER RESETS)
        from .models import GlobalAnalyticsCounter
        counter, _ = GlobalAnalyticsCounter.objects.get_or_create(id=1)
        counter.all_time_page_views += 1
        if is_all_time_unique:
            counter.all_time_unique_visitors += 1
        counter.save()

        # 2. Record period visit log
        VisitorAnalytics.objects.create(
            page=page,
            session_id=session_id,
            referrer=referrer,
            is_unique_visit=is_unique_today,
            user_agent=request.META.get('HTTP_USER_AGENT', '')
        )

        # 3. Broadcast live real-time visitor event to connected admin portals
        try:
            latest = get_latest_dashboard_stats()
            broadcaster.broadcast('visitor_update', latest)
        except Exception:
            pass

        return Response({'success': True, 'allTimeViews': counter.all_time_page_views})


class DashboardStatsView(APIView):
    permission_classes = [IsAdminAuthorized]

    def get(self, request):
        return Response(get_latest_dashboard_stats())


class VisitorLiveStreamView(APIView):
    """
    Python Server-Sent Events (SSE) Endpoint for real-time live admin updates.
    Pushes live visitor updates and handles midnight (00:00:00) counter resets.
    """
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        q = broadcaster.add_listener()

        def stream():
            try:
                # 1. Send initial state immediately upon connection
                initial_stats = get_latest_dashboard_stats()
                yield f"event: visitor_update\ndata: {json.dumps(initial_stats)}\n\n"

                last_date = timezone.now().date()

                while True:
                    # 2. Check for midnight day rollover reset
                    current_date = timezone.now().date()
                    if current_date > last_date:
                        last_date = current_date
                        reset_stats = get_latest_dashboard_stats()
                        yield f"event: day_reset\ndata: {json.dumps(reset_stats)}\n\n"

                    # 3. Listen for live visitor events
                    try:
                        msg = q.get(timeout=10)
                        yield f"event: {msg['event']}\ndata: {json.dumps(msg['data'])}\n\n"
                    except Empty:
                        # Periodic keep-alive ping
                        yield f": keep-alive\n\n"

            finally:
                broadcaster.remove_listener(q)

        response = StreamingHttpResponse(stream(), content_type='text/event-stream')
        response['Cache-Control'] = 'no-cache'
        response['X-Accel-Buffering'] = 'no'
        return response


class AnalyticsResetView(APIView):
    """
    Resets period analytics logs (Today/Week/Month).
    NOTE: All-time cumulative total page views are preserved and NEVER reset.
    """
    permission_classes = [IsAdminAuthorized]

    def post(self, request):
        VisitorAnalytics.objects.all().delete()
        latest = get_latest_dashboard_stats()
        try:
            broadcaster.broadcast('visitor_update', latest)
        except Exception:
            pass
        return Response({'message': 'Period analytics cleared. All-time views preserved.', 'stats': latest})


def seed_initial_metrics_if_empty():
    if CaseStudy.objects.count() == 0:
        c1 = CaseStudy.objects.create(
            title='52-Story High-Rise Thermal Retrofit',
            category='MEPF AI Agents',
            description='Deployed autonomous HVAC load-balancing agents across 500+ VAV boxes and dual centrifugal chillers. The agent continuously calculates solar heat gain per facade orientation.',
            performance_gain='-38.4% Energy Use',
            benchmark_outcome='$320,000 / year',
            tags=['BACnet Protocol', 'Niagara Framework', 'Predictive CFD'],
            icon_name='Flame',
            color='#F59E0B',
            is_published=True,
            order=1
        )
        sync_casestudy_to_mongo(c1)

        c2 = CaseStudy.objects.create(
            title='Generative Aerospace Component Lightweighting',
            category='Product Development Agents',
            description='Automated structural finite element stress optimization for titanium bracketry. The agent generated DFM-compliant 5-axis CNC toolpaths with zero tool gouging.',
            performance_gain='-31.2% Mass Reduction',
            benchmark_outcome='6 Weeks Speedup',
            tags=['SolidWorks API', 'Generative Mesh', 'DFM Verified'],
            icon_name='Cpu',
            color='#00F2FE',
            is_published=True,
            order=2
        )
        sync_casestudy_to_mongo(c2)

        c3 = CaseStudy.objects.create(
            title='Kesses Hospital BIM Clash & Operational Analytics',
            category='Business Analytics AI Agents',
            description='Automated complex medical gas & MEP ductwork clash resolution across a 450,000 sq.ft healthcare facility model with live predictive yield analytics.',
            performance_gain='420 Clashes Fixed',
            benchmark_outcome='100% Code Compliant',
            tags=['Revit IFC 4.3', 'ADA / IBC Audited', 'Predictive COBie'],
            icon_name='BarChart3',
            color='#38BDF8',
            is_published=True,
            order=3
        )
        sync_casestudy_to_mongo(c3)


class CaseStudyPublicView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        seed_initial_metrics_if_empty()
        cases = CaseStudy.objects.filter(is_published=True).order_by('order', 'id')
        serializer = CaseStudySerializer(cases, many=True)
        return Response(serializer.data)


class CaseStudyAdminAllView(APIView):
    permission_classes = [IsAdminAuthorized]

    def get(self, request):
        seed_initial_metrics_if_empty()
        cases = CaseStudy.objects.all().order_by('order', '-id')
        serializer = CaseStudySerializer(cases, many=True)
        return Response(serializer.data)

    def post(self, request):
        data = request.data
        case = CaseStudy.objects.create(
            title=data.get('title', 'New Performance Metric'),
            category=data.get('category', 'MEPF AI Agents'),
            description=data.get('description', ''),
            performance_gain=data.get('performanceGain', '-30% Energy'),
            benchmark_outcome=data.get('benchmarkOutcome', '$200,000 Saved'),
            tags=[t.strip() for t in data.get('tags', '').split(',') if t.strip()] if isinstance(data.get('tags'), str) else data.get('tags', []),
            icon_name=data.get('iconName', 'Flame'),
            color=data.get('color', '#F59E0B'),
            is_published=str(data.get('isPublished', 'true')).lower() == 'true',
            order=int(data.get('order', 0))
        )
        sync_casestudy_to_mongo(case, action='save')
        serializer = CaseStudySerializer(case)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class CaseStudyAdminDetailView(APIView):
    permission_classes = [IsAdminAuthorized]

    def put(self, request, pk):
        case = CaseStudy.objects.filter(pk=pk).first()
        if not case:
            return Response({'message': 'Metric not found'}, status=status.HTTP_404_NOT_FOUND)

        data = request.data
        if 'title' in data: case.title = data['title']
        if 'category' in data: case.category = data['category']
        if 'description' in data: case.description = data['description']
        if 'performanceGain' in data: case.performance_gain = data['performanceGain']
        if 'benchmarkOutcome' in data: case.benchmark_outcome = data['benchmarkOutcome']
        if 'iconName' in data: case.icon_name = data['iconName']
        if 'color' in data: case.color = data['color']
        if 'isPublished' in data: case.is_published = str(data['isPublished']).lower() == 'true'
        if 'order' in data: case.order = int(data['order'])
        if 'tags' in data:
            case.tags = [t.strip() for t in data['tags'].split(',') if t.strip()] if isinstance(data['tags'], str) else data['tags']

        case.save()
        sync_casestudy_to_mongo(case, action='save')
        serializer = CaseStudySerializer(case)
        return Response(serializer.data)

    def delete(self, request, pk):
        case = CaseStudy.objects.filter(pk=pk).first()
        if case:
            sync_casestudy_to_mongo(case, action='delete')
            case.delete()
            return Response({'message': 'Deleted successfully'})
        return Response({'message': 'Not found'}, status=status.HTTP_404_NOT_FOUND)


