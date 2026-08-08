import React from 'react';
import { Cpu, ArrowUpRight, ShieldCheck, Heart } from 'lucide-react';

export default function Footer({ onOpenProposal }) {
  return (
    <footer style={{ borderTop: '1px solid var(--border-subtle)', background: '#04060A', paddingTop: '80px', paddingBottom: '40px', position: 'relative', zIndex: 2 }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1.2fr', gap: '48px', marginBottom: '60px' }} className="footer-grid">
          
          {/* Col 1: Brand & Status */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  background: 'rgba(56,189,248,0.2)',
                  border: '1px solid rgba(56, 189, 248, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Cpu size={20} color="#38BDF8" />
              </div>
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.35rem', fontWeight: 800, color: '#FFF' }}>
                BIMAXIS<span style={{ color: 'var(--accent-cyan)' }}>Group</span>
              </span>
            </div>

            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginBottom: '24px', maxWidth: '340px', lineHeight: 1.65 }}>
              Architected by licensed Architects and Design Engineers. Building autonomous AI agents for Product Engineering, HVAC Thermal balancing, Smart Security, and Building Information Modeling (BIM).
            </p>

            {/* System Status Pill */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                padding: '8px 16px',
                borderRadius: '20px',
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                fontSize: '0.8rem',
                color: '#10B981',
                fontWeight: 600,
              }}
            >
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981', boxShadow: '0 0 8px #10B981' }} />
              <span>All Agent Gateway Nodes Operational (99.98% Uptime)</span>
            </div>
          </div>

          {/* Col 2: AI Agent Domains */}
          <div>
            <h4 style={{ fontSize: '0.95rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--accent-cyan)', marginBottom: '20px' }}>
              Agent Solutions
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <a href="#services" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.2s' }}>HVAC Automation AI</a>
              <a href="#services" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.2s' }}>Plumbing & Hydraulic AI</a>
              <a href="#services" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.2s' }}>BIM Code & Clash AI</a>
              <a href="#services" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.2s' }}>Product CAD & DFM AI</a>
              <a href="#services" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.2s' }}>Spatial Security AI</a>
            </div>
          </div>

          {/* Col 3: Navigation */}
          <div>
            <h4 style={{ fontSize: '0.95rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--accent-cyan)', marginBottom: '20px' }}>
              Company
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <a href="#team" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.2s' }}>Engineering Team</a>
              <a href="#case-studies" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.2s' }}>Case Studies & Metrics</a>
              <a href="#roi-calculator" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.2s' }}>ROI Estimator Tool</a>
              <a href="#simulator" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.2s' }}>Interactive Sandbox</a>
            </div>
          </div>

          {/* Col 4: Consultation CTA Box */}
          <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
            <h4 style={{ fontSize: '1rem', color: '#FFF', marginBottom: '8px' }}>Build Your Custom Agent</h4>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginBottom: '16px', lineHeight: 1.5 }}>
              Talk directly with our AIA Architects and PE Design Engineers.
            </p>
            <button onClick={onOpenProposal} className="btn btn-primary" style={{ width: '100%', padding: '12px', fontSize: '0.88rem' }}>
              <span>Request Consultation</span>
              <ArrowUpRight size={16} />
            </button>
          </div>

        </div>

        {/* Bottom Bar */}
        <div style={{ paddingTop: '30px', borderTop: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', fontSize: '0.84rem', color: 'var(--text-muted)' }}>
          <div>
            © {new Date().getFullYear()} BIMAXISGroup Inc. All rights reserved. Designed for Product Engineering & Built Environment Applications.
          </div>
          <div style={{ display: 'flex', gap: '24px' }}>
            <span>BACnet / Tridium Certified</span>
            <span>IFC / Revit API Partner</span>
            <span>AIA & PE Engineering Compliance</span>
          </div>
        </div>

      </div>

      <style>{`
        @media (max-width: 900px) {
          .footer-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 600px) {
          .footer-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </footer>
  );
}
