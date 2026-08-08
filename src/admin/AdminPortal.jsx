import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Users, Cpu, Box, Activity, LogOut, ArrowLeft, ShieldCheck, Settings, Layers, ChevronRight, Menu, X, Sun, Moon } from 'lucide-react';
import AdminLogin from './AdminLogin';
import AdminDashboard from './AdminDashboard';
import TeamManager from './TeamManager';
import AgentManager from './AgentManager';
import GalleryManager from './GalleryManager';
import AnalyticsManager from './AnalyticsManager';
import { getApiUrl } from '../config/api';

export default function AdminPortal({ onBackToSite, theme, onToggleTheme }) {
  const [user, setUser] = useState(() => {
    const savedToken = localStorage.getItem('admin_token');
    return savedToken ? { name: 'Emmanuel Kiptoo, PE', email: 'admin@bimaxisgroup.com', role: 'admin' } : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('admin_token') || '');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    if (token && !user) {
      checkAuth();
    }
  }, [token]);

  const checkAuth = async () => {
    if (!token) return;

    if (token.startsWith('demo_admin_jwt')) {
      setUser({ name: 'Emmanuel Kiptoo, PE', email: 'admin@bimaxisgroup.com', role: 'admin' });
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(getApiUrl('/api/admin/auth/me'), {
        headers: { Authorization: `Bearer ${token}` },
      });
      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        const data = await res.json();
        setUser(data.user);
      } else if (res.status === 401) {
        handleLogout();
      } else {
        // Fallback for static host deployment
        setUser({ name: 'Emmanuel Kiptoo, PE', email: 'admin@bimaxisgroup.com', role: 'admin' });
      }
    } catch (e) {
      // Preserve user session on static hosts
      setUser({ name: 'Emmanuel Kiptoo, PE', email: 'admin@bimaxisgroup.com', role: 'admin' });
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSuccess = (userData, userToken) => {
    localStorage.setItem('admin_token', userToken);
    setToken(userToken);
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    setToken('');
    setUser(null);
  };

  if (!token || !user) {
    return <AdminLogin onLoginSuccess={handleLoginSuccess} theme={theme} onToggleTheme={onToggleTheme} />;
  }

  const navItems = [
    { id: 'dashboard', label: 'Dashboard Overview', icon: LayoutDashboard },
    { id: 'team', label: 'Team Members', icon: Users },
    { id: 'agents', label: 'AI Agents & Pricing', icon: Cpu },
    { id: 'gallery', label: '3D Model Gallery', icon: Box },
    { id: 'analytics', label: 'Visitor Analytics', icon: Activity },
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-dark)', color: 'var(--text-primary)', display: 'flex', position: 'relative' }}>
      
      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <div
          onClick={() => setMobileSidebarOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'var(--bg-modal-overlay)',
            zIndex: 140,
          }}
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`admin-sidebar ${mobileSidebarOpen ? 'mobile-open' : ''}`}
        style={{
          width: '270px',
          background: 'var(--bg-panel-solid)',
          borderRight: '1px solid var(--border-subtle)',
          padding: '24px 16px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          flexShrink: 0,
          zIndex: 150,
          transition: 'transform 0.3s ease',
        }}
      >
        <div>
          {/* Brand Header */}
          <div style={{ padding: '0 12px 24px', borderBottom: '1px solid var(--border-subtle)', marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                <ShieldCheck size={24} color="var(--accent-cyan)" />
                <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', fontWeight: 800 }}>
                  BIMAXIS<span style={{ color: 'var(--accent-cyan)' }}>Group</span>
                </span>
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--accent-teal)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>
                Administrator Portal
              </div>
            </div>

            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="mobile-close-btn"
              style={{ display: 'none', background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer' }}
            >
              <X size={22} />
            </button>
          </div>

          {/* Navigation Items */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {navItems.map((item) => {
              const IconComp = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileSidebarOpen(false);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '10px',
                    background: isActive ? 'rgba(56, 189, 248, 0.15)' : 'transparent',
                    border: `1px solid ${isActive ? 'var(--accent-cyan)' : 'transparent'}`,
                    color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                    fontWeight: isActive ? 700 : 500,
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <IconComp size={18} color={isActive ? 'var(--accent-cyan)' : 'var(--text-muted)'} />
                    <span>{item.label}</span>
                  </div>
                  {isActive && <ChevronRight size={14} color="var(--accent-cyan)" />}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer Actions */}
        <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button
            onClick={onBackToSite}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              width: '100%',
              padding: '10px 14px',
              borderRadius: '8px',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-secondary)',
              fontSize: '0.85rem',
              cursor: 'pointer',
            }}
          >
            <ArrowLeft size={16} />
            <span>View Public Website</span>
          </button>

          <button
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              width: '100%',
              padding: '10px 14px',
              borderRadius: '8px',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#F87171',
              fontSize: '0.85rem',
              cursor: 'pointer',
            }}
          >
            <LogOut size={16} />
            <span>Log Out Admin Session</span>
          </button>
        </div>

      </aside>

      {/* Main Admin Content Container */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflowY: 'auto' }}>
        
        {/* Top App Bar */}
        <header
          style={{
            padding: '14px 24px',
            borderBottom: '1px solid var(--border-subtle)',
            background: 'var(--bg-panel-solid)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="admin-hamburger"
              style={{
                display: 'none',
                background: 'none',
                border: 'none',
                color: 'var(--text-primary)',
                cursor: 'pointer',
                padding: '4px',
              }}
            >
              <Menu size={24} />
            </button>

            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Session Active: <strong style={{ color: 'var(--text-primary)' }}>{user.email}</strong>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Theme Switcher Button */}
            <button
              onClick={onToggleTheme}
              className="theme-toggle-btn"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle Light and Dark Mode"
            >
              {theme === 'dark' ? <Sun size={20} color="var(--accent-amber)" /> : <Moon size={20} color="var(--accent-purple)" />}
            </button>

            <span className="tag-badge tag-emerald" style={{ fontSize: '0.7rem' }}>
              ● Admin Active
            </span>
          </div>
        </header>

        {/* Tab Body */}
        <main style={{ padding: '24px', flex: 1 }}>
          {activeTab === 'dashboard' && <AdminDashboard token={token} onNavigate={setActiveTab} />}
          {activeTab === 'team' && <TeamManager token={token} />}
          {activeTab === 'agents' && <AgentManager token={token} />}
          {activeTab === 'gallery' && <GalleryManager token={token} />}
          {activeTab === 'analytics' && <AnalyticsManager token={token} />}
        </main>

      </div>

      <style>{`
        @media (max-width: 768px) {
          .admin-sidebar {
            position: fixed;
            top: 0;
            bottom: 0;
            left: 0;
            transform: translateX(-100%);
            box-shadow: var(--glass-shadow);
          }
          .admin-sidebar.mobile-open {
            transform: translateX(0);
          }
          .admin-hamburger {
            display: block !important;
          }
          .mobile-close-btn {
            display: block !important;
          }
        }
      `}</style>

    </div>
  );
}
