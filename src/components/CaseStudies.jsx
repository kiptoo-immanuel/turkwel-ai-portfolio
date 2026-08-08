import React, { useState, useEffect } from 'react';
import { ArrowUpRight, Building2, Flame, Cpu, Shield, TrendingUp, BarChart3, Zap, ShieldCheck } from 'lucide-react';
import { getApiUrl } from '../config/api';

const ICON_MAP = {
  Flame: Flame,
  Cpu: Cpu,
  Building2: Building2,
  BarChart3: BarChart3,
  TrendingUp: TrendingUp,
  Zap: Zap,
  ShieldCheck: ShieldCheck,
};

const INITIAL_CASES = [
  {
    id: 'default-1',
    title: '52-Story High-Rise Thermal Retrofit',
    category: 'MEPF AI Agents',
    iconName: 'Flame',
    color: '#F59E0B',
    performanceGain: '-38.4% Energy Use',
    benchmarkOutcome: '$320,000 / year',
    description:
      'Deployed autonomous HVAC load-balancing agents across 500+ VAV boxes and dual centrifugal chillers. The agent continuously calculates solar heat gain per facade orientation.',
    tags: ['BACnet Protocol', 'Niagara Framework', 'Predictive CFD'],
  },
  {
    id: 'default-2',
    title: 'Generative Aerospace Component Lightweighting',
    category: 'Product Development Agents',
    iconName: 'Cpu',
    color: '#00F2FE',
    performanceGain: '-31.2% Mass',
    benchmarkOutcome: '6 Weeks Speedup',
    description:
      'Automated structural finite element stress optimization for titanium bracketry. The agent generated DFM-compliant 5-axis CNC toolpaths with zero tool gouging.',
    tags: ['SolidWorks API', 'Generative Mesh', 'DFM Verified'],
  },
  {
    id: 'default-3',
    title: 'Kesses Hospital BIM Clash & Operational Analytics',
    category: 'Business Analytics AI Agents',
    iconName: 'BarChart3',
    color: '#38BDF8',
    performanceGain: '420 Clashes Fixed',
    benchmarkOutcome: '100% Code Compliant',
    description:
      'Automated complex medical gas & MEP ductwork clash resolution across a 450,000 sq.ft healthcare facility model with live predictive yield analytics.',
    tags: ['Revit IFC 4.3', 'ADA / IBC Audited', 'Predictive COBie'],
  },
];

export default function CaseStudies({ onOpenProposal }) {
  const [cases, setCases] = useState(INITIAL_CASES);
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    try {
      const res = await fetch(getApiUrl('/api/metrics/public/'));
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setCases(data);
        }
      }
    } catch (e) {
      console.error('Failed to fetch public metrics:', e);
    }
  };

  const categories = ['All', 'MEPF AI Agents', 'Product Development Agents', 'Business Analytics AI Agents'];

  const filteredCases = activeCategory === 'All'
    ? cases
    : cases.filter((c) => c.category === activeCategory);

  return (
    <section id="case-studies" style={{ padding: '100px 0', background: 'rgba(7, 9, 14, 0.6)', position: 'relative' }}>
      <div className="container">
        
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '760px', margin: '0 auto 48px' }}>
          <span className="tag-badge" style={{ marginBottom: '16px' }}>
            <TrendingUp size={14} /> Proven Performance Metrics
          </span>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', marginBottom: '18px', fontWeight: 800 }}>
            Real-World Impact Across <span className="gradient-text">Physical & Spatial AI</span>
          </h2>
          <p style={{ fontSize: '1.08rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            Quantifiable benchmarks achieved by our <strong>MEPF AI Agents</strong>, <strong>Product Development Agents</strong>, and <strong>Business Analytics AI Agents</strong> in live building deployments and manufacturing lines.
          </p>
        </div>

        {/* Category Tabs */}
        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '50px' }}>
          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  padding: '10px 22px',
                  borderRadius: '24px',
                  border: isActive ? '1px solid var(--accent-cyan)' : '1px solid var(--border-subtle)',
                  background: isActive ? 'linear-gradient(135deg, rgba(56, 189, 248, 0.18), rgba(0, 242, 254, 0.08))' : 'var(--bg-panel-solid)',
                  color: isActive ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                  boxShadow: isActive ? '0 0 16px rgba(56, 189, 248, 0.2)' : 'none',
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '32px' }}>
          {filteredCases.map((item, idx) => {
            const IconComp = ICON_MAP[item.iconName || item.icon_name] || TrendingUp;
            const itemColor = item.color || '#F59E0B';
            const gain = item.performanceGain || item.performance_gain || item.stats || 'High Impact';
            const outcome = item.benchmarkOutcome || item.benchmark_outcome || item.savings || 'Verified';
            const itemTags = Array.isArray(item.tags) ? item.tags : (item.tags ? item.tags.split(',') : []);

            return (
              <div
                key={item.id || item._id || idx}
                className="glass-panel"
                style={{
                  padding: '32px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  borderRadius: '20px',
                  border: '1px solid var(--border-subtle)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                    <span
                      className="tag-badge"
                      style={{
                        color: itemColor,
                        borderColor: `${itemColor}40`,
                        background: 'rgba(255,255,255,0.04)',
                        fontWeight: 700,
                      }}
                    >
                      {item.category}
                    </span>
                    <div
                      style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '12px',
                        background: 'rgba(255,255,255,0.04)',
                        border: `1px solid ${itemColor}40`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <IconComp size={22} color={itemColor} />
                    </div>
                  </div>

                  <h3 style={{ fontSize: '1.35rem', marginBottom: '12px', fontWeight: 800, color: 'var(--text-primary)' }}>
                    {item.title}
                  </h3>
                  <p style={{ fontSize: '0.94rem', color: 'var(--text-secondary)', marginBottom: '24px', lineHeight: 1.65 }}>
                    {item.description}
                  </p>
                </div>

                <div>
                  {/* Stat Highlights */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '16px',
                      padding: '18px',
                      background: 'var(--bg-panel-solid)',
                      borderRadius: '14px',
                      marginBottom: '20px',
                      border: '1px solid var(--border-subtle)',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' }}>
                        Performance Gain
                      </div>
                      <div style={{ fontSize: '1.15rem', fontWeight: 800, color: itemColor, marginTop: '2px' }}>
                        {gain}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' }}>
                        Benchmark Outcome
                      </div>
                      <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>
                        {outcome}
                      </div>
                    </div>
                  </div>

                  {/* Tags */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {itemTags.map((t, i) => (
                      <span
                        key={i}
                        style={{
                          fontSize: '0.76rem',
                          padding: '5px 12px',
                          borderRadius: '8px',
                          background: 'rgba(255,255,255,0.04)',
                          color: 'var(--text-muted)',
                          border: '1px solid var(--border-subtle)',
                          fontWeight: 500,
                        }}
                      >
                        {typeof t === 'string' ? t.trim() : t}
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

