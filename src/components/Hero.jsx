import React from 'react';
import { ArrowRight, ShieldCheck, Zap, Layers, Sparkles, Building2, Flame, Cpu, Compass } from 'lucide-react';

export default function Hero({ onOpenProposal }) {
  return (
    <section style={{ position: 'relative', paddingTop: '140px', paddingBottom: '80px', overflow: 'hidden' }}>
      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', alignItems: 'center' }} className="hero-grid">
          
          {/* Hero Left Content */}
          <div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '24px' }}>
              <a
                href="#services"
                className="tag-badge"
                style={{ textDecoration: 'none', cursor: 'pointer', transition: 'all 0.2s ease' }}
              >
                <Sparkles size={14} /> Autonomous AI Systems
              </a>
              <a
                href="#team"
                className="tag-badge tag-amber"
                style={{ textDecoration: 'none', cursor: 'pointer', transition: 'all 0.2s ease' }}
              >
                <Compass size={14} /> Architects & Engineers On-Team
              </a>
            </div>

            <h1 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.8rem)', lineHeight: 1.15, marginBottom: '24px', color: 'var(--text-primary)' }}>
              Building <span className="gradient-text">Autonomous AI Agents</span> for Physical & Digital Environments.
            </h1>

            <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '36px', lineHeight: 1.7, maxWidth: '580px' }}>
              We design and deploy specialized AI agent networks that transform <strong>Product Development</strong> and the <strong>Built Environment</strong>—automating complex HVAC load analysis, smart-building security, generative CAD, and BIM compliance to accelerate delivery, reduce errors, and bring engineering-grade precision to every project.
            </p>

            {/* CTAs */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginBottom: '48px' }} className="hero-ctas">
              <button onClick={onOpenProposal} className="btn btn-primary hero-btn" style={{ padding: '16px 32px', fontSize: '1.05rem' }}>
                <span>Deploy Custom Agent</span>
                <ArrowRight size={18} />
              </button>

              <a href="#simulator" className="btn btn-secondary hero-btn" style={{ padding: '16px 28px', fontSize: '1.05rem' }}>
                <Zap size={18} color="var(--accent-cyan)" />
                <span>Try Live Sandbox</span>
              </a>
            </div>

            {/* Feature Highlights Pills */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(245,158,11,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Flame size={20} color="var(--accent-amber)" />
                </div>
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>HVAC Thermal AI</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>35-45% Energy Reduction</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(56,189,248,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Building2 size={20} color="var(--accent-cyan)" />
                </div>
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>BIM AI Agents</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Automated Clash & Code Audits</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(0,242,254,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Cpu size={20} color="var(--accent-teal)" />
                </div>
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>Product Development</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Generative DFM & CAD</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(16,185,129,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ShieldCheck size={20} color="var(--accent-emerald)" />
                </div>
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>Smart Security Systems</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Spatial Vision Anomaly Detection</div>
                </div>
              </div>
            </div>

          </div>

          {/* Hero Right Visualizer Card */}
          <div style={{ position: 'relative' }}>
            <div className="glass-panel" style={{ overflow: 'hidden', padding: '12px', border: '1px solid var(--border-glow)' }}>
              <div style={{ position: 'relative', width: '100%', height: '420px', borderRadius: '12px', overflow: 'hidden' }}>
                <img
                  src="/assets/hero_building.jpg"
                  alt="BIMAXISGroup Building Twin"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />

                {/* Gradient Overlay */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, var(--bg-modal-overlay) 0%, transparent 60%)',
                  }}
                />

                {/* Floating Metric Badge Top Right */}
                <div
                  className="floating"
                  style={{
                    position: 'absolute',
                    top: '20px',
                    right: '20px',
                    background: 'var(--bg-card)',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid var(--border-glow)',
                    borderRadius: '12px',
                    padding: '12px 18px',
                    boxShadow: 'var(--glass-shadow)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', color: 'var(--accent-cyan)', fontWeight: 700, textTransform: 'uppercase' }}>
                    <Zap size={14} /> BACnet HVAC Active
                  </div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    -38.4% <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}>Energy Savings</span>
                  </div>
                </div>

                {/* Floating Metric Badge Bottom Left */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: '20px',
                    left: '20px',
                    right: '20px',
                    background: 'var(--bg-card)',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '12px',
                    padding: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Active BIM Simulation</div>
                    <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>Structural & MEP Clash Resolver</div>
                  </div>
                  <span className="tag-badge tag-emerald">0 Clashes</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      <style>{`
        @media (max-width: 992px) {
          .hero-grid {
            grid-template-columns: 1fr !important;
            gap: 36px !important;
          }
          section {
            padding-top: 110px !important;
          }
        @media (max-width: 480px) {
          .hero-btn {
            width: 100% !important;
            justify-content: center !important;
          }
        }
      `}</style>
    </section>
  );
}
