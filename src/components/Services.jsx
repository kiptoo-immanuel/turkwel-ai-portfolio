import React, { useState } from 'react';
import { Cpu, Flame, Shield, Building2, Droplets, CheckCircle2, ArrowUpRight, Sparkles, Layers, Terminal } from 'lucide-react';

export default function Services({ onOpenProposal }) {
  const [activeTab, setActiveTab] = useState('all');

  const servicesData = [
    {
      id: 'hvac',
      category: 'built-environment',
      icon: Flame,
      color: '#F59E0B',
      title: 'HVAC Automation Agents',
      subtitle: 'Predictive Thermal Load Balancing & Energy AI',
      description:
        'Custom autonomous agents connected directly to BACnet, Modbus, and Niagara Tridium frameworks. Our agents run continuous predictive thermal simulations, dynamic damper adjustments, and automated fault diagnostics.',
      highlights: [
        '30% to 45% verifiably lowered chiller/boiler energy consumption',
        'Occupant comfort adaptive feedback loop learning',
        'Automated Predictive Maintenance & FDD alerts',
        'Seamless integration with legacy BMS control hardware',
      ],
      badge: 'Built Environment',
      image: '/assets/hvac_bim.jpg',
    },
    {
      id: 'plumbing',
      category: 'built-environment',
      icon: Droplets,
      color: '#06B6D4',
      title: 'Plumbing & Hydraulic System Agents',
      subtitle: 'Smart Water Management & Leak Anomaly AI',
      description:
        'Autonomous hydraulic monitoring agents for commercial water supply, greywater recycling, and stormwater networks. Automatically balances pump head pressure, detects micro-leak anomalies, and optimizes hot water loops.',
      highlights: [
        'Real-time acoustic & flow differential leak anomaly detection',
        'Automated VFD booster pump pressure balancing & energy reduction',
        'Legionella thermal flush scheduling & water quality AI compliance',
        'Hydraulic pipe friction & flow velocity automated calculation in BIM',
      ],
      badge: 'Built Environment',
      image: '/assets/hvac_bim.jpg',
    },
    {
      id: 'bim',
      category: 'built-environment',
      icon: Building2,
      color: '#38BDF8',
      title: 'BIM AI Agents',
      subtitle: 'Automated Clash Resolution & Code Compliance',
      description:
        'Designed by our licensed Architects and Structural Engineers, our BIM AI agents plug directly into Revit, ArchiCAD, and openIFC pipelines to resolve complex MEP & plumbing clashes and enforce strict building code compliance.',
      highlights: [
        'Automated 3D clash detection and parametric pipe/duct re-routing',
        'Instant International Building Code (IBC) & ADA compliance auditing',
        'Generative floorplan layout & structural load optimization',
        'COBie asset tag auto-generation from 3D models',
      ],
      badge: 'Built Environment',
      image: '/assets/hero_building.jpg',
    },
    {
      id: 'product',
      category: 'product-dev',
      icon: Cpu,
      color: '#00F2FE',
      title: 'Product Development Agents',
      subtitle: 'Generative CAD, DFM & Materials Intelligence',
      description:
        'Empowering mechanical engineers and industrial designers with custom agents that perform generative component design, automated stress FEA analysis, and real-time design-for-manufacturing (DFM) verification.',
      highlights: [
        'Generative structural weight reduction & lattice mesh design',
        'Automated DFM verification for CNC, injection molding & 3D printing',
        'Real-time Bill of Materials (BOM) & component pricing scrapers',
        'Automated CAD export across STEP, IGES, and SolidWorks native formats',
      ],
      badge: 'Product Engineering',
      image: '/assets/product_cad.jpg',
    },
    {
      id: 'security',
      category: 'built-environment',
      icon: Shield,
      color: '#10B981',
      title: 'Smart Security Systems Agents',
      subtitle: 'Spatial Computer Vision & Access Control AI',
      description:
        'Autonomous surveillance and perimeter security agents that process edge video feeds, detect unauthorized access, manage spatial occupancy limits, and orchestrate automated emergency lockdown responses.',
      highlights: [
        'Real-time computer vision perimeter anomaly & threat classification',
        'Autonomous access control credentialing & visitor badge management',
        'Spatial occupancy tracking & fire code egress compliance',
        'Zero-latency edge deployment with local privacy masking',
      ],
      badge: 'Built Environment',
      image: '/assets/hvac_bim.jpg',
    },
  ];

  const filteredServices =
    activeTab === 'all'
      ? servicesData
      : servicesData.filter((item) => item.category === activeTab);

  return (
    <section id="services" style={{ padding: '100px 0', position: 'relative' }}>
      <div className="container">
        
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 60px' }}>
          <span className="tag-badge" style={{ marginBottom: '16px' }}>
            <Layers size={14} /> Core Engineering Capabilities
          </span>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', marginBottom: '18px' }}>
            Autonomous AI Agents for <span className="gradient-text">Engineering Excellence</span>
          </h2>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>
            We fuse deep machine learning with hands-on architectural and mechanical engineering expertise to build custom agents that transform physical assets and physical products.
          </p>
        </div>

        {/* Filter Tabs */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '12px',
            marginBottom: '48px',
            flexWrap: 'wrap',
          }}
        >
          <button
            onClick={() => setActiveTab('all')}
            className={`btn ${activeTab === 'all' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ borderRadius: '30px', padding: '10px 24px', fontSize: '0.9rem' }}
          >
            All AI Agents
          </button>
          <button
            onClick={() => setActiveTab('built-environment')}
            className={`btn ${activeTab === 'built-environment' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ borderRadius: '30px', padding: '10px 24px', fontSize: '0.9rem' }}
          >
            Built Environment
          </button>
          <button
            onClick={() => setActiveTab('product-dev')}
            className={`btn ${activeTab === 'product-dev' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ borderRadius: '30px', padding: '10px 24px', fontSize: '0.9rem' }}
          >
            Product Development AI
          </button>
        </div>

        {/* Services Cards Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(540px, 1fr))',
            gap: '32px',
          }}
          className="services-grid"
        >
          {filteredServices.map((service) => {
            const IconComponent = service.icon;
            return (
              <div key={service.id} className="glass-panel" style={{ padding: '36px', position: 'relative', overflow: 'hidden' }}>
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div
                      style={{
                        width: '52px',
                        height: '52px',
                        borderRadius: '14px',
                        background: `rgba(${parseInt(service.color.slice(1, 3), 16)}, ${parseInt(service.color.slice(3, 5), 16)}, ${parseInt(service.color.slice(5, 7), 16)}, 0.12)`,
                        border: `1px solid ${service.color}40`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <IconComponent size={28} color={service.color} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.45rem', marginBottom: '4px' }}>{service.title}</h3>
                      <div style={{ fontSize: '0.88rem', color: service.color, fontWeight: 600 }}>
                        {service.subtitle}
                      </div>
                    </div>
                  </div>
                  <span className="tag-badge" style={{ fontSize: '0.72rem' }}>
                    {service.badge}
                  </span>
                </div>

                <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', fontSize: '0.98rem', lineHeight: 1.65 }}>
                  {service.description}
                </p>

                {/* Checklist */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
                  {service.highlights.map((h, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                      <CheckCircle2 size={18} color={service.color} style={{ marginTop: '2px', flexShrink: 0 }} />
                      <span style={{ fontSize: '0.92rem', color: 'var(--text-primary)' }}>{h}</span>
                    </div>
                  ))}
                </div>

                {/* Footer Action */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '20px', borderTop: '1px solid var(--border-subtle)' }}>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    Reviewed by Architects & Design Engineers
                  </span>
                  <button
                    onClick={onOpenProposal}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: service.color,
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '0.92rem',
                    }}
                  >
                    <span>Configure Agent</span>
                    <ArrowUpRight size={18} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      <style>{`
        @media (max-width: 640px) {
          .services-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
