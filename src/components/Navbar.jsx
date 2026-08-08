import React, { useState, useEffect } from 'react';
import { Cpu, Menu, X, ArrowRight, Sun, Moon, FileText } from 'lucide-react';

export default function Navbar({ onOpenProposal, theme, onToggleTheme }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        transition: 'all 0.25s ease-in-out',
        background: scrolled
          ? (theme === 'light' ? 'rgba(255, 255, 255, 0.95)' : 'rgba(7, 9, 14, 0.92)')
          : (theme === 'light' ? 'rgba(255, 255, 255, 0.85)' : 'rgba(7, 9, 14, 0.6)'),
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border-subtle)',
        padding: scrolled ? '8px 0' : '12px 0',
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          width: '100%',
        }}
      >
        {/* Brand Logo - Clear, Unobstructed & Always Legible */}
        <a
          href="#"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            textDecoration: 'none',
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, rgba(56,189,248,0.2), rgba(0,242,254,0.1))',
              border: '1px solid var(--accent-cyan)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 10px rgba(56,189,248,0.25)',
              flexShrink: 0,
            }}
          >
            <Cpu size={18} color="var(--accent-cyan)" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div
              className="brand-title"
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.2rem',
                fontWeight: 800,
                letterSpacing: '-0.02em',
                color: 'var(--text-primary)',
                lineHeight: 1.1,
                whiteSpace: 'nowrap',
              }}
            >
              BIMAXIS<span style={{ color: 'var(--accent-cyan)' }}>Group</span>
            </div>
            <div
              className="brand-subtitle"
              style={{
                fontSize: '0.58rem',
                color: 'var(--text-muted)',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                fontWeight: 600,
                lineHeight: 1,
                marginTop: '2px',
              }}
            >
              Design & Automation
            </div>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '18px' }} className="desktop-nav">
          <a href="#services" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: 500, fontSize: '0.88rem', transition: 'color 0.2s' }}>
            Services & Agents
          </a>
          <a href="#gallery" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: 500, fontSize: '0.88rem', transition: 'color 0.2s' }}>
            3D Gallery
          </a>
          <a href="#simulator" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: 500, fontSize: '0.88rem', transition: 'color 0.2s' }}>
            Live Sandbox
          </a>
          <a href="#case-studies" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: 500, fontSize: '0.88rem', transition: 'color 0.2s' }}>
            Case Studies
          </a>
          <a href="#team" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: 500, fontSize: '0.88rem', transition: 'color 0.2s' }}>
            Engineering Team
          </a>
          <a href="#roi-calculator" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: 500, fontSize: '0.88rem', transition: 'color 0.2s' }}>
            ROI Estimator
          </a>
        </nav>

        {/* Header Right Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
          
          {/* Light / Dark Mode Switcher */}
          <button
            onClick={onToggleTheme}
            className="theme-toggle-btn"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle Light and Dark Mode"
            style={{ width: '34px', height: '34px', borderRadius: '8px', flexShrink: 0 }}
          >
            {theme === 'dark' ? <Sun size={16} color="var(--accent-amber)" /> : <Moon size={16} color="var(--accent-purple)" />}
          </button>

          {/* Perfectly Scaled, Non-Obstructive Request Proposal Button */}
          <button
            onClick={onOpenProposal}
            className="btn btn-primary header-proposal-btn"
            style={{
              padding: '7px 14px',
              fontSize: '0.82rem',
              fontWeight: 700,
              borderRadius: '8px',
              whiteSpace: 'nowrap',
              flexShrink: 0,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '5px',
              lineHeight: 1,
              boxShadow: '0 2px 10px rgba(56, 189, 248, 0.3)',
              cursor: 'pointer',
            }}
          >
            <FileText size={14} style={{ flexShrink: 0 }} />
            <span className="proposal-text-full">Request Proposal</span>
            <span className="proposal-text-short" style={{ display: 'none' }}>Proposal</span>
          </button>

          {/* Mobile Drawer Hamburger Icon */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="mobile-toggle-icon"
            aria-label="Toggle Mobile Navigation Menu"
            style={{
              display: 'none',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '8px',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              padding: '4px',
              width: '34px',
              height: '34px',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Modern Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            background: theme === 'light' ? 'rgba(255, 255, 255, 0.98)' : 'rgba(11, 15, 25, 0.98)',
            backdropFilter: 'blur(20px)',
            padding: '18px 20px 24px',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            boxShadow: 'var(--glass-shadow)',
          }}
        >
          <a
            href="#services"
            onClick={() => setMobileMenuOpen(false)}
            style={{ color: 'var(--text-primary)', textDecoration: 'none', fontSize: '0.95rem', fontWeight: 600 }}
          >
            Services & AI Agents
          </a>
          <a
            href="#gallery"
            onClick={() => setMobileMenuOpen(false)}
            style={{ color: 'var(--text-primary)', textDecoration: 'none', fontSize: '0.95rem', fontWeight: 600 }}
          >
            3D Model Gallery
          </a>
          <a
            href="#simulator"
            onClick={() => setMobileMenuOpen(false)}
            style={{ color: 'var(--text-primary)', textDecoration: 'none', fontSize: '0.95rem', fontWeight: 600 }}
          >
            Live Sandbox Control Room
          </a>
          <a
            href="#case-studies"
            onClick={() => setMobileMenuOpen(false)}
            style={{ color: 'var(--text-primary)', textDecoration: 'none', fontSize: '0.95rem', fontWeight: 600 }}
          >
            Case Studies
          </a>
          <a
            href="#team"
            onClick={() => setMobileMenuOpen(false)}
            style={{ color: 'var(--text-primary)', textDecoration: 'none', fontSize: '0.95rem', fontWeight: 600 }}
          >
            Engineering Team
          </a>
          <a
            href="#roi-calculator"
            onClick={() => setMobileMenuOpen(false)}
            style={{ color: 'var(--text-primary)', textDecoration: 'none', fontSize: '0.95rem', fontWeight: 600 }}
          >
            ROI Estimator
          </a>

          {/* Full-Width Mobile Drawer Proposal CTA */}
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenProposal();
            }}
            className="btn btn-primary"
            style={{ width: '100%', padding: '12px', marginTop: '4px', fontSize: '0.95rem', display: 'flex', justifyContent: 'center', gap: '8px' }}
          >
            <FileText size={16} />
            <span>Request Custom Proposal</span>
            <ArrowRight size={16} />
          </button>
        </div>
      )}

      <style>{`
        @media (max-width: 992px) {
          .desktop-nav { display: none !important; }
          .mobile-toggle-icon { display: flex !important; }
        }
        @media (max-width: 640px) {
          .brand-subtitle { display: none !important; }
          .header-proposal-btn {
            padding: 6px 10px !important;
            font-size: 0.78rem !important;
          }
        }
        @media (max-width: 480px) {
          .brand-title {
            font-size: 1.05rem !important;
          }
          .proposal-text-full { display: none !important; }
          .proposal-text-short { display: inline !important; }
        }
      `}</style>
    </header>
  );
}
