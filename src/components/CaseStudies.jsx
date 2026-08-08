import React from 'react';
import { ArrowUpRight, Building2, Flame, Cpu, Shield, TrendingUp } from 'lucide-react';

export default function CaseStudies({ onOpenProposal }) {
  const cases = [
    {
      title: '52-Story High-Rise Thermal Retrofit',
      category: 'HVAC Automation Agent',
      icon: Flame,
      color: '#F59E0B',
      stats: '-38.4% Energy Use',
      savings: '$320,000 / year',
      description:
        'Deployed autonomous HVAC load-balancing agents across 500+ VAV boxes and dual centrifugal chillers. The agent continuously calculates solar heat gain per facade orientation.',
      tags: ['BACnet Protocol', 'Niagara Framework', 'Predictive CFD'],
    },
    {
      title: 'Generative Aerospace Component Lightweighting',
      category: 'Product Development Agent',
      icon: Cpu,
      color: '#00F2FE',
      stats: '-31.2% Mass',
      savings: '6 Weeks Speedup',
      description:
        'Automated structural finite element stress optimization for titanium bracketry. The agent generated DFM-compliant 5-axis CNC toolpaths with zero tool gouging.',
      tags: ['SolidWorks API', 'Generative Mesh', 'DFM Verified'],
    },
    {
      title: 'Kesses Hospital BIM Clash Resolution',
      category: 'BIM AI Application',
      icon: Building2,
      color: '#38BDF8',
      stats: '420 Clashes Fixed',
      savings: '100% Code Compliant',
      description:
        'Automated complex medical gas & MEP ductwork clash resolution across a 450,000 sq.ft healthcare facility model within 3 hours prior to construction bidding.',
      tags: ['Revit IFC 4.3', 'ADA / IBC Audited', 'COBie Tags'],
    },
  ];

  return (
    <section id="case-studies" style={{ padding: '100px 0', background: 'rgba(7, 9, 14, 0.6)', position: 'relative' }}>
      <div className="container">
        
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 60px' }}>
          <span className="tag-badge" style={{ marginBottom: '16px' }}>
            <TrendingUp size={14} /> Proven Performance Metrics
          </span>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', marginBottom: '18px' }}>
            Real-World Impact Across <span className="gradient-text">Physical Engineering</span>
          </h2>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>
            Explore how our AI agents deliver immediate cost reductions and technical precision in real building deployments and manufacturing lines.
          </p>
        </div>

        {/* Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '32px' }}>
          {cases.map((item, idx) => {
            const IconComp = item.icon;
            return (
              <div key={idx} className="glass-panel" style={{ padding: '32px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                    <span className="tag-badge" style={{ color: item.color, borderColor: `${item.color}40`, background: 'rgba(255,255,255,0.04)' }}>
                      {item.category}
                    </span>
                    <IconComp size={24} color={item.color} />
                  </div>

                  <h3 style={{ fontSize: '1.35rem', marginBottom: '12px' }}>{item.title}</h3>
                  <p style={{ fontSize: '0.94rem', color: 'var(--text-secondary)', marginBottom: '24px', lineHeight: 1.6 }}>
                    {item.description}
                  </p>
                </div>

                <div>
                  {/* Stat Highlights */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', padding: '16px', background: 'rgba(15, 23, 42, 0.6)', borderRadius: '12px', marginBottom: '20px', border: '1px solid var(--border-subtle)' }}>
                    <div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Performance Gain</div>
                      <div style={{ fontSize: '1.15rem', fontWeight: 800, color: item.color }}>{item.stats}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Benchmark Outcome</div>
                      <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)' }}>{item.savings}</div>
                    </div>
                  </div>

                  {/* Tags */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {item.tags.map((t, i) => (
                      <span key={i} style={{ fontSize: '0.75rem', padding: '4px 10px', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)' }}>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
