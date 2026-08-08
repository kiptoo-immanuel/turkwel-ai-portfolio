from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from api.models import TeamMember, AIAgent, AgentPricing, Model3D

class Command(BaseCommand):
    help = 'Seeds default Admin Superuser, Team Members, AI Agents, and 3D Models into Django database'

    def handle(self, *args, **kwargs):
        # 1. Superuser
        if not User.objects.filter(username='admin').exists():
            admin_user = User.objects.create_superuser(
                username='admin',
                email='admin@bimaxisgroup.com',
                password='AdminBIMAXIS2026!',
                first_name='Emmanuel',
                last_name='Kiptoo, PE'
            )
            self.stdout.write(self.style.SUCCESS('[Django Seed] Created Admin Superuser: admin@bimaxisgroup.com / AdminBIMAXIS2026!'))

        # 2. Team Members
        if TeamMember.objects.count() == 0:
            TeamMember.objects.create(
                name='Emmanuel Kiptoo, PE',
                position='Lead Design Engineer & Thermal Automation Director',
                biography='Licensed Professional Engineer (PE) specializing in mechanical design engineering, HVAC systems, and thermal fluids. Leads our Product Development and BMS HVAC energy optimization agent division.',
                email='mannykiptoo@gmail.com',
                linkedin='https://linkedin.com/in/kiptoo-emmanuel',
                profile_image='/assets/team-placeholder.jpg',
                skills=['BIM', 'Revit MEP', 'HVAC Thermal Fluid Simulation', 'Generative DFM'],
                qualifications=['Licensed PE (Mechanical & Design)', 'Certified REVIT MEP Expert', 'Fluid & Thermal Dynamics'],
                is_published=True
            )
            TeamMember.objects.create(
                name='Elena Rostova, AIA',
                position='Chief Architect & Spatial AI Lead',
                biography='Licensed Architect with 14+ years designing high-density commercial towers and complex healthcare facilities. Pioneers our BIM parametric agents and automated code compliance models.',
                profile_image='/assets/team-placeholder.jpg',
                skills=['Revit Computational', 'Spatial Informatics', 'IBC Compliance'],
                qualifications=['Licensed Architect (AIA)', 'Ph.D. Spatial Informatics'],
                is_published=True
            )
            self.stdout.write(self.style.SUCCESS('[Django Seed] Initialized default Team Members.'))

        # 3. AI Agents & Pricing
        if AIAgent.objects.count() == 0:
            agent1 = AIAgent.objects.create(
                name='HVAC Thermal Load Balancer Agent',
                short_description='Predictive Thermal Load Balancing & Energy AI',
                full_description='Custom autonomous agents connected directly to BACnet, Modbus, and Niagara Tridium frameworks. Runs continuous predictive thermal simulations, dynamic damper adjustments, and automated fault diagnostics.',
                category='built-environment',
                features=['BACnet/Tridium Integration', 'Predictive Thermal Load Balancing', 'Automated FDD Fault Detection', 'Occupant Comfort Learning'],
                benefits=['30%-45% Energy Reduction', 'Zero Manual Chiller Tweaks', 'Instant BMS Integration'],
                image='/assets/hvac_bim.jpg',
                published=True,
                available=True
            )
            AgentPricing.objects.create(ai_agent=agent1, plan_name='Basic Facility', price=149.0, billing_type='monthly')
            AgentPricing.objects.create(ai_agent=agent1, plan_name='Enterprise Campus', price=499.0, billing_type='monthly')

            agent2 = AIAgent.objects.create(
                name='BIM Clash & Code Auditor Agent',
                short_description='Automated 3D MEP Clash Resolution & IBC Code Auditing',
                full_description='Plugs directly into Revit, ArchiCAD, and openIFC pipelines to resolve complex MEP clashes and enforce strict building code compliance.',
                category='built-environment',
                features=['Parametric IFC Re-routing', 'IBC & ADA Compliance Check', 'COBie Tag Auto Generation'],
                benefits=['4.5 Hours Saved per Model', 'Zero On-site MEP Conflicts'],
                image='/assets/hero_building.jpg',
                published=True,
                available=True
            )
            AgentPricing.objects.create(ai_agent=agent2, plan_name='Per Model Scan', price=99.0, billing_type='one_time')
            AgentPricing.objects.create(ai_agent=agent2, plan_name='Unlimited Studio', price=299.0, billing_type='monthly')

            self.stdout.write(self.style.SUCCESS('[Django Seed] Initialized default AI Agents & Pricing.'))

        # 4. 3D Models
        if Model3D.objects.count() == 0:
            Model3D.objects.create(
                title='Commercial HVAC Chiller & Air Riser System',
                short_description='3D MEP parametric model showing chiller piping and ductwork routing.',
                full_description='High-density commercial tower HVAC equipment layout exported from Revit. Features dynamic thermal sensors and VFD air handler nodes.',
                category='MEP',
                tags=['HVAC', 'Revit MEP', 'Chiller', 'Piping'],
                source_file_url='/uploads/models_source/sample_hvac.rvt',
                source_file_name='commercial_hvac_riser.rvt',
                source_file_format='rvt',
                converted_file_url='/uploads/converted/sample_hvac.glb',
                thumbnail_url='/assets/hero_building.jpg',
                conversion_status='ready',
                is_published=True,
                is_featured=True
            )
            Model3D.objects.create(
                title='Titanium Generative Drone Arm Component',
                short_description='Generative CAD structural mesh lightweighting model.',
                full_description='Optimized via FEA stress simulation for maximum rigidity at 31% reduced mass.',
                category='Product',
                tags=['Generative CAD', 'SolidWorks', 'FEA', 'Aerospace'],
                source_file_url='/uploads/models_source/sample_drone.step',
                source_file_name='generative_drone_arm.step',
                source_file_format='step',
                converted_file_url='/uploads/converted/sample_drone.glb',
                thumbnail_url='/assets/product_cad.jpg',
                conversion_status='ready',
                is_published=True,
                is_featured=True
            )
            self.stdout.write(self.style.SUCCESS('[Django Seed] Initialized default 3D Models.'))
