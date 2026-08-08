import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Users, Cpu, Box, Activity, LogOut, ArrowLeft, ShieldCheck, Settings, Layers, ChevronRight, Menu, X, Sun, Moon, TrendingUp } from 'lucide-react';
import AdminLogin from './AdminLogin';
import AdminDashboard from './AdminDashboard';
import TeamManager from './TeamManager';
import AgentManager from './AgentManager';
import GalleryManager from './GalleryManager';
import MetricsManager from './MetricsManager';
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
        setUser({ name: 'Emmanuel Kiptoo, PE', email: 'admin@bimaxisgroup.com', role: 'admin' });
      }
    } catch (e) {
      console.error('Auth verify error:', e);
      setUser({ name: 'Emmanuel Kiptoo, PE', email: 'admin@bimaxisgroup.com', role: 'admin' });
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSuccess = (userObj, tokenStr) => {
    setUser(userObj);
    setToken(tokenStr);
    localStorage.setItem('admin_token', tokenStr);
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
    { id: 'metrics', label: 'Proven Metrics', icon: TrendingUp },
    { id: 'analytics', label: 'Visitor Analytics', icon: Activity },
  ];

  const currentTab = navItems.find((i) => i.id === activeTab);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-dark)', color: 'var(--text-primary)', display: 'flex', position: 'relative' }}>
      
      {/* Mobile Sidebar Backdrop Overlay */}
      {mobileSidebarOpen && (
        <div
          onClick={() => setMobileSidebarOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'var(--bg-modal-overlay)',
            backdropFilter: 'blur(4px)',
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
          transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <div>
          {/* Brand Header */}
          <div style={{ padding: '0 8px 20px', borderBottom: '1px solid var(--border-subtle)', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                <ShieldCheck size={24} color="var(--accent-cyan)" />
                <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', fontWeight: 800 }}>
                  BIMAXIS<span style={{ color: 'var(--accent-cyan)' }}>Group</span>
                </span>
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>
                Enterprise Admin Portal
              </div>
            </div>

            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="mobile-close-btn"
              aria-label="Close Admin Sidebar"
              style={{
                display: 'none',
                background: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '8px',
                color: 'var(--text-primary)',
                cursor: 'pointer',
                padding: '6px',
                width: '34px',
                height: '34px',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <X size={18} />
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
                    padding: '12px 14px',
                    borderRadius: '10px',
                    border: isActive ? '1px solid var(--border-glow)' : '1px solid transparent',
                    background: isActive ? 'linear-gradient(135deg, rgba(56, 189, 248, 0.15), rgba(0, 242, 254, 0.05))' : 'transparent',
                    color: isActive ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                    fontWeight: isActive ? 700 : 500,
                    fontSize: '0.92rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease-in-out',
                    width: '100%',
                    textAlign: 'left',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <IconComp size={18} color={isActive ? 'var(--accent-cyan)' : 'var(--text-muted)'} />
                    <span>{item.label}</span>
                  </div>
                  {isActive && <ChevronRight size={16} color="var(--accent-cyan)" />}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer Actions */}
        <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button
            onClick={onBackToSite}
            className="btn btn-secondary"
            style={{ width: '100%', justifyContent: 'center', padding: '10px', fontSize: '0.85rem' }}
          >
            <ArrowLeft size={16} />
            <span>Back to Public Website</span>
          </button>

          <button
            onClick={handleLogout}
            className="btn btn-secondary"
            style={{
              width: '100%',
              justifyContent: 'center',
              padding: '10px',
              fontSize: '0.85rem',
              borderColor: 'rgba(239, 68, 68, 0.3)',
              color: '#F87171',
            }}
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>


      </aside>

      {/* Main Admin Content Container */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflowY: 'auto' }}>
        
        {/* Top App Bar */}
        <header
          style={{
            padding: '12px 20px',
            borderBottom: '1px solid var(--border-subtle)',
            background: 'var(--bg-panel-solid)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="admin-hamburger"
              aria-label="Open Navigation Drawer"
              style={{
                display: 'none',
                background: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '8px',
                color: 'var(--text-primary)',
                cursor: 'pointer',
                padding: '6px',
                width: '38px',
                height: '38px',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Menu size={20} />
            </button>

            <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
              <div style={{ fontSize: '0.95rem', color: 'var(--text-primary)', fontWeight: 700, lineHeight: 1.2, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{currentTab?.label || 'Dashboard'}</span>
              </div>
              <div className="admin-session-email" style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                {user.email}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            {/* Theme Switcher Button */}
            <button
              onClick={onToggleTheme}
              className="theme-toggle-btn"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle Light and Dark Mode"
              style={{ width: '34px', height: '34px', borderRadius: '8px', flexShrink: 0 }}
            >
              {theme === 'dark' ? <Sun size={16} color="var(--accent-amber)" /> : <Moon size={16} color="var(--accent-purple)" />}
            </button>

            {/* Responsive Active Admin Badge */}
            <span className="admin-status-badge" title="Admin Session Active">
              <span className="admin-pulse-dot" />
              <span className="admin-status-text">Admin Active</span>
            </span>
          </div>
        </header>

        {/* Mobile Horizontal Quick Tab Bar */}
        <div className="mobile-admin-tabs">
          {navItems.map((item) => {
            const IconComp = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`mobile-tab-btn ${isActive ? 'active' : ''}`}
              >
                <IconComp size={14} color={isActive ? 'var(--accent-cyan)' : 'var(--text-muted)'} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Body */}
        <main className="admin-main-content" style={{ padding: '24px', flex: 1 }}>
          {activeTab === 'dashboard' && <AdminDashboard token={token} onNavigate={setActiveTab} />}
          {activeTab === 'team' && <TeamManager token={token} />}
          {activeTab === 'agents' && <AgentManager token={token} />}
          {activeTab === 'gallery' && <GalleryManager token={token} />}
          {activeTab === 'metrics' && <MetricsManager token={token} />}
          {activeTab === 'analytics' && <AnalyticsManager token={token} />}
        </main>

      </div>

      <style>{`
        .admin-status-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 10px;
          border-radius: 20px;
          background: rgba(16, 185, 129, 0.12);
          border: 1px solid rgba(16, 185, 129, 0.3);
          color: #10B981;
          font-size: 0.74rem;
          font-weight: 700;
          white-space: nowrap;
        }
        .admin-pulse-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #10B981;
          box-shadow: 0 0 8px #10B981;
          animation: adminPulse 1.8s infinite;
          flex-shrink: 0;
        }
        .admin-pulse-dot-small {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: var(--accent-cyan);
          box-shadow: 0 0 6px var(--accent-cyan);
          animation: adminPulse 1.8s infinite;
        }
        @keyframes adminPulse {
          0% { transform: scale(0.95); opacity: 0.8; }
          50% { transform: scale(1.3); opacity: 1; box-shadow: 0 0 10px #10B981; }
          100% { transform: scale(0.95); opacity: 0.8; }
        }
        .mobile-admin-tabs {
          display: none;
        }

        @media (max-width: 768px) {
          .admin-sidebar {
            position: fixed;
            top: 0;
            bottom: 0;
            left: 0;
            width: 280px !important;
            max-width: 85vw !important;
            transform: translateX(-100%);
            box-shadow: 0 0 30px rgba(0, 0, 0, 0.7);
            z-index: 200 !important;
          }
          .admin-sidebar.mobile-open {
            transform: translateX(0);
          }
          .admin-hamburger {
            display: flex !important;
          }
          .mobile-close-btn {
            display: flex !important;
          }
          .mobile-admin-tabs {
            display: flex !important;
            overflow-x: auto;
            white-space: nowrap;
            padding: 8px 12px;
            background: var(--bg-card);
            border-bottom: 1px solid var(--border-subtle);
            gap: 8px;
            scrollbar-width: none;
          }
          .mobile-admin-tabs::-webkit-scrollbar {
            display: none;
          }
          .mobile-tab-btn {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 6px 12px;
            border-radius: 20px;
            background: transparent;
            border: 1px solid var(--border-subtle);
            color: var(--text-secondary);
            font-size: 0.78rem;
            font-weight: 600;
            cursor: pointer;
            flex-shrink: 0;
            transition: all 0.2s ease;
          }
          .mobile-tab-btn.active {
            background: rgba(56, 189, 248, 0.15);
            border-color: var(--accent-cyan);
            color: var(--accent-cyan);
            box-shadow: 0 0 10px rgba(56, 189, 248, 0.2);
          }
        }
        @media (max-width: 640px) {
          .admin-main-content {
            padding: 14px 12px !important;
          }
        }
        @media (max-width: 480px) {
          .admin-status-text {
            display: none;
          }
          .admin-status-badge {
            padding: 6px;
            border-radius: 50%;
          }
          .admin-session-email {
            max-width: 140px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
      `}</style>

    </div>
  );
}
