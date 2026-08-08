import React, { useState } from 'react';
import { Lock, Mail, ShieldCheck, ArrowRight, Info, CheckCircle2, Sun, Moon } from 'lucide-react';
import { getApiUrl } from '../config/api';

export default function AdminLogin({ onLoginSuccess, theme, onToggleTheme }) {
  const [email, setEmail] = useState('admin@bimaxisgroup.com');
  const [password, setPassword] = useState('AdminBIMAXIS2026!');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    // Check credentials against standard admin list
    const validEmails = ['admin@bimaxisgroup.com', 'mannykiptoo@gmail.com', 'admin'];
    const isValidAdminCreds = validEmails.includes(cleanEmail) && cleanPassword === 'AdminBIMAXIS2026!';

    try {
      const targetUrl = getApiUrl('/api/admin/auth/login');
      const response = await fetch(targetUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, password: cleanPassword }),
      });

      const contentType = response.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        const data = await response.json();
        if (response.ok) {
          localStorage.setItem('admin_token', data.token);
          onLoginSuccess(data.user, data.token);
          return;
        } else {
          if (!isValidAdminCreds) {
            setError(data.message || 'Invalid administrator password or email.');
            setLoading(false);
            return;
          }
        }
      }
    } catch (err) {
      console.warn('[Admin Auth] API fetch error or static host environment:', err);
    }

    // Static host fallback (e.g. GitHub Pages static site)
    if (isValidAdminCreds) {
      const dummyToken = 'demo_admin_jwt_token_2026';
      const dummyUser = {
        name: 'Emmanuel Kiptoo, PE',
        email: cleanEmail.includes('@') ? cleanEmail : 'admin@bimaxisgroup.com',
        role: 'admin',
      };
      localStorage.setItem('admin_token', dummyToken);
      onLoginSuccess(dummyUser, dummyToken);
    } else {
      setError('Invalid administrator password or email.');
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = () => {
    setEmail('admin@bimaxisgroup.com');
    setPassword('AdminBIMAXIS2026!');
    const dummyToken = 'demo_admin_jwt_token_2026';
    const dummyUser = {
      name: 'Emmanuel Kiptoo, PE',
      email: 'admin@bimaxisgroup.com',
      role: 'admin',
    };
    localStorage.setItem('admin_token', dummyToken);
    onLoginSuccess(dummyUser, dummyToken);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--bg-dark)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        position: 'relative',
      }}
    >
      {/* Top Corner Theme Switcher */}
      {onToggleTheme && (
        <div style={{ position: 'absolute', top: '24px', right: '24px' }}>
          <button
            onClick={onToggleTheme}
            className="theme-toggle-btn"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle Light and Dark Mode"
            style={{ padding: '8px', cursor: 'pointer', background: 'transparent', border: 'none' }}
          >
            {theme === 'dark' ? <Sun size={20} color="var(--accent-amber)" /> : <Moon size={20} color="var(--accent-purple)" />}
          </button>
        </div>
      )}

      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '460px',
          padding: '40px',
          border: '1px solid var(--border-glow)',
          boxShadow: 'var(--glass-shadow)',
        }}
      >
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, rgba(56,189,248,0.2), rgba(0,242,254,0.1))',
              border: '1px solid var(--accent-cyan)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              boxShadow: '0 0 20px rgba(56,189,248,0.3)',
            }}
          >
            <ShieldCheck size={30} color="var(--accent-cyan)" />
          </div>
          <h2 style={{ fontSize: '1.75rem', marginBottom: '6px' }}>
            BIMAXIS<span style={{ color: 'var(--accent-cyan)' }}>Group</span>
          </h2>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
            Administrator Portal
          </div>
        </div>

        {error && (
          <div
            style={{
              padding: '12px 16px',
              borderRadius: '8px',
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              color: '#F87171',
              fontSize: '0.88rem',
              marginBottom: '24px',
              lineHeight: 1.5,
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
              Admin Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@bimaxisgroup.com or mannykiptoo@gmail.com"
                style={{
                  width: '100%',
                  padding: '12px 16px 12px 42px',
                  borderRadius: '8px',
                  background: 'var(--bg-input)',
                  border: '1px solid var(--border-subtle)',
                  color: '#FFF',
                  fontSize: '0.95rem',
                }}
              />
              <Mail size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
              Admin Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                style={{
                  width: '100%',
                  padding: '12px 16px 12px 42px',
                  borderRadius: '8px',
                  background: 'var(--bg-input)',
                  border: '1px solid var(--border-subtle)',
                  color: '#FFF',
                  fontSize: '0.95rem',
                }}
              />
              <Lock size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ padding: '14px', fontSize: '1rem', marginTop: '10px', width: '100%' }}
          >
            <span>{loading ? 'Authenticating Session...' : 'Log In to Administrator Portal'}</span>
            <ArrowRight size={18} />
          </button>

          {/* Quick One-Click Demo Access Button */}
          <button
            type="button"
            onClick={handleQuickDemoLogin}
            className="btn btn-secondary"
            style={{
              padding: '12px',
              fontSize: '0.88rem',
              width: '100%',
              borderColor: 'rgba(56, 189, 248, 0.4)',
              color: 'var(--accent-cyan)',
              background: 'rgba(56, 189, 248, 0.08)',
            }}
          >
            <CheckCircle2 size={16} />
            <span>One-Click Quick Admin Entry</span>
          </button>

          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: '8px', lineHeight: 1.5 }}>
            Valid Emails: <strong style={{ color: '#FFF' }}>admin@bimaxisgroup.com</strong> or <strong style={{ color: '#FFF' }}>mannykiptoo@gmail.com</strong>
            <br />
            Password: <strong style={{ color: 'var(--accent-teal)' }}>AdminBIMAXIS2026!</strong>
          </div>
        </form>
      </div>
    </div>
  );
}
