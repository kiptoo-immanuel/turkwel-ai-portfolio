import React, { useEffect, useState, useRef } from 'react';
import { Users, Cpu, Box, Activity, CheckCircle2, AlertTriangle, Clock, Layers, ArrowUpRight, Zap, RefreshCw, Radio } from 'lucide-react';
import { getApiUrl } from '../config/api';

export default function AdminDashboard({ token, onNavigate }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLiveStreamConnected, setIsLiveStreamConnected] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState('');

  // Initial dynamic stats structure strictly with zero defaults (No hardcoded fake numbers)
  const emptyStats = {
    visitors: { allTimeViews: 0, allTimeUniques: 0, total: 0, today: 0, todayUnique: 0, week: 0, weekUnique: 0, month: 0, monthUnique: 0 },
    team: { total: 0 },
    agents: { total: 0, available: 0, unavailable: 0 },
    models3d: { total: 0, product: 0, mep: 0, structural: 0, processing: 0, ready: 0, failed: 0 },
    topPages: [],
    trafficTrend: [],
  };

  const fetchStats = async () => {
    try {
      const res = await fetch(getApiUrl('/api/analytics/admin/dashboard-stats/'), {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setStats(data);
        setLastSyncTime(new Date().toLocaleTimeString());
      }
    } catch (e) {
      console.warn('[Analytics Dashboard] Stats fetch error:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // 1. Initial fetch
    fetchStats();

    // 2. Real-time Live Stream (Server-Sent Events) with error resiliency
    let eventSource = null;
    let reconnectTimeout = null;

    const connectLiveStream = () => {
      try {
        const streamUrl = getApiUrl('/api/analytics/admin/live-stream/');
        eventSource = new EventSource(streamUrl);

        eventSource.onopen = () => {
          setIsLiveStreamConnected(true);
        };

        eventSource.addEventListener('visitor_update', (e) => {
          try {
            const liveData = JSON.parse(e.data);
            setStats(liveData);
            setLastSyncTime(new Date().toLocaleTimeString());
            setIsLiveStreamConnected(true);
          } catch (err) {}
        });

        eventSource.addEventListener('day_reset', (e) => {
          try {
            const resetData = JSON.parse(e.data);
            setStats(resetData);
            setLastSyncTime(new Date().toLocaleTimeString());
          } catch (err) {}
        });

        eventSource.onerror = (err) => {
          setIsLiveStreamConnected(false);
          if (eventSource) {
            eventSource.close();
          }
          // Retry connection after 5 seconds
          reconnectTimeout = setTimeout(connectLiveStream, 5000);
        };
      } catch (e) {
        setIsLiveStreamConnected(false);
      }
    };

    connectLiveStream();

    // 3. Resilient Polling Fallback (Every 6 seconds) to guarantee crash-free updates on all cloud hosts
    const pollingInterval = setInterval(() => {
      fetchStats();
    }, 6000);

    return () => {
      if (eventSource) eventSource.close();
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
      clearInterval(pollingInterval);
    };
  }, [token]);

  const currentStats = stats || emptyStats;
  const visitors = currentStats.visitors || emptyStats.visitors;
  const models3d = currentStats.models3d || emptyStats.models3d;
  const agents = currentStats.agents || emptyStats.agents;
  const team = currentStats.team || emptyStats.team;

  // Compute maximum views in 7-day trend for scaling bars
  const maxViews = Math.max(...(currentStats.trafficTrend || []).map(t => t.totalViews || 0), 1);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      
      {/* Top Banner Overview */}
      <div
        className="glass-panel"
        style={{
          padding: '24px 28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          background: 'linear-gradient(135deg, var(--bg-panel-solid), var(--bg-card))',
          border: '1px solid var(--border-subtle)',
          borderRadius: '16px',
          boxShadow: 'var(--glass-shadow)',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 10px',
                borderRadius: '20px',
                background: isLiveStreamConnected ? 'rgba(16,185,129,0.12)' : 'rgba(56,189,248,0.12)',
                border: isLiveStreamConnected ? '1px solid rgba(16,185,129,0.3)' : '1px solid rgba(56,189,248,0.3)',
                fontSize: '0.75rem',
                fontWeight: 700,
                color: isLiveStreamConnected ? '#10B981' : 'var(--accent-cyan)',
              }}
            >
              <Radio size={12} className="floating" />
              {isLiveStreamConnected ? 'Live Analytics Stream Connected' : 'Live Polling Stream Active'}
            </span>

            {lastSyncTime && (
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Updated at {lastSyncTime}
              </span>
            )}
          </div>

          <h2 style={{ fontSize: '1.7rem', fontWeight: 800, marginBottom: '4px', letterSpacing: '-0.02em' }}>
            Executive Live Analytics Dashboard
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', margin: 0 }}>
            Cumulative all-time pageviews persist continuously. Period counters reset automatically.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            onClick={fetchStats}
            className="btn btn-secondary"
            style={{ padding: '9px 16px', fontSize: '0.86rem', fontWeight: 600, borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}
            title="Refresh analytics data"
          >
            <RefreshCw size={15} className={loading ? 'spinning' : ''} />
            <span>Refresh</span>
          </button>

          <button
            onClick={() => onNavigate('gallery')}
            className="btn btn-secondary"
            style={{ padding: '9px 18px', fontSize: '0.86rem', fontWeight: 600, borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Box size={16} color="var(--accent-cyan)" />
            <span>3D Models</span>
          </button>

          <button
            onClick={() => onNavigate('agents')}
            className="btn btn-primary"
            style={{ padding: '9px 18px', fontSize: '0.86rem', fontWeight: 700, borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Cpu size={16} />
            <span>AI Agents</span>
          </button>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '18px' }}>
        
        {/* Card 1: All-Time Page Views (NEVER RESETS) */}
        <div
          className="glass-panel"
          style={{
            padding: '22px 24px',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-glow)',
            borderRadius: '14px',
            transition: 'all 0.25s ease',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <div>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.04em' }}>
                All-Time Page Views
              </span>
              <div style={{ fontSize: '0.7rem', color: 'var(--accent-teal)', fontWeight: 600 }}>● Never Resets</div>
            </div>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(56,189,248,0.12)', border: '1px solid rgba(56,189,248,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Activity size={18} color="var(--accent-cyan)" />
            </div>
          </div>

          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '12px', lineHeight: 1 }}>
            {(visitors.allTimeViews ?? visitors.total ?? 0).toLocaleString()}
          </div>

          <div style={{ display: 'flex', gap: '14px', fontSize: '0.78rem', color: 'var(--text-secondary)', borderTop: '1px solid var(--border-subtle)', paddingTop: '12px' }}>
            <span>Today: <strong style={{ color: 'var(--accent-teal)' }}>{(visitors.today ?? 0).toLocaleString()}</strong></span>
            <span>Week: <strong style={{ color: 'var(--text-primary)' }}>{(visitors.week ?? 0).toLocaleString()}</strong></span>
            <span>Month: <strong style={{ color: 'var(--text-primary)' }}>{(visitors.month ?? 0).toLocaleString()}</strong></span>
          </div>
        </div>

        {/* Card 2: AI Agent Inventory */}
        <div
          className="glass-panel"
          style={{
            padding: '22px 24px',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '14px',
            transition: 'all 0.25s ease',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.04em' }}>
              AI Agent Inventory
            </span>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(0,242,254,0.12)', border: '1px solid rgba(0,242,254,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Cpu size={18} color="var(--accent-teal)" />
            </div>
          </div>
          <div style={{ fontSize: '2.1rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '12px', lineHeight: 1 }}>
            {agents.total ?? 0} <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>Agents</span>
          </div>
          <div style={{ display: 'flex', gap: '14px', fontSize: '0.78rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '12px' }}>
            <span className="tag-badge tag-emerald" style={{ fontSize: '0.7rem' }}>Available: {agents.available ?? 0}</span>
            <span style={{ color: 'var(--text-muted)' }}>Unavailable: {agents.unavailable ?? 0}</span>
          </div>
        </div>

        {/* Card 3: 3D Model Gallery */}
        <div
          className="glass-panel"
          style={{
            padding: '22px 24px',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '14px',
            transition: 'all 0.25s ease',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.04em' }}>
              3D Model Gallery
            </span>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Box size={18} color="var(--accent-amber)" />
            </div>
          </div>
          <div style={{ fontSize: '2.1rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '12px', lineHeight: 1 }}>
            {models3d.total ?? 0} <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>CAD Models</span>
          </div>
          <div style={{ display: 'flex', gap: '10px', fontSize: '0.75rem', color: 'var(--text-secondary)', borderTop: '1px solid var(--border-subtle)', paddingTop: '12px' }}>
            <span>Product: {models3d.product ?? 0}</span>
            <span>MEP: {models3d.mep ?? 0}</span>
            <span>Structural: {models3d.structural ?? 0}</span>
          </div>
        </div>

        {/* Card 4: Team Members */}
        <div
          className="glass-panel"
          style={{
            padding: '22px 24px',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '14px',
            transition: 'all 0.25s ease',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.04em' }}>
              Engineering Team
            </span>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Users size={18} color="#10B981" />
            </div>
          </div>
          <div style={{ fontSize: '2.1rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '12px', lineHeight: 1 }}>
            {team.total ?? 0} <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>Engineers</span>
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--accent-teal)', borderTop: '1px solid var(--border-subtle)', paddingTop: '12px', fontWeight: 600 }}>
            ● Dynamic Database Sync
          </div>
        </div>

      </div>

      {/* 3D Conversion Pipeline Queue Status Banner */}
      <div className="glass-panel" style={{ padding: '24px', borderRadius: '14px', border: '1px solid var(--border-glow)', background: 'var(--bg-card)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(56, 189, 248, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Layers size={20} color="var(--accent-cyan)" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>Automated 3D Conversion Pipeline Status</h3>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                Processing Revit (.rvt), SolidWorks (.step), and IFC files into lightweight WebGL GLTF models.
              </div>
            </div>
          </div>
          <button onClick={() => onNavigate('gallery')} className="btn btn-secondary" style={{ padding: '6px 14px', fontSize: '0.8rem', fontWeight: 600, borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>View 3D Pipeline</span>
            <ArrowUpRight size={14} />
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px' }}>
          <div style={{ padding: '12px 16px', borderRadius: '10px', background: 'var(--bg-panel-solid)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <CheckCircle2 size={22} color="#10B981" />
            <div>
              <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)' }}>{models3d.ready ?? 0}</div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Ready for Public Viewer</div>
            </div>
          </div>

          <div style={{ padding: '12px 16px', borderRadius: '10px', background: 'var(--bg-panel-solid)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Clock size={22} color="var(--accent-amber)" />
            <div>
              <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--accent-amber)' }}>{models3d.processing ?? 0}</div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Processing GLTF Pipeline</div>
            </div>
          </div>

          <div style={{ padding: '12px 16px', borderRadius: '10px', background: 'var(--bg-panel-solid)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <AlertTriangle size={22} color="#EF4444" />
            <div>
              <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)' }}>{models3d.failed ?? 0}</div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Conversion Errors</div>
            </div>
          </div>
        </div>
      </div>

      {/* Traffic Trend Chart (Dynamic Zero State & Computed Bars) */}
      <div className="glass-panel" style={{ padding: '24px 28px', borderRadius: '14px', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '2px' }}>Website Traffic Trends</h3>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Daily Pageviews vs Unique Visitor sessions over the last 7 days</div>
          </div>
          <span className="tag-badge tag-emerald" style={{ fontSize: '0.72rem' }}>
            Live Stream Active
          </span>
        </div>

        {/* SVG Bar Analytics Chart */}
        <div style={{ width: '100%', height: '210px', display: 'flex', alignItems: 'flex-end', gap: '14px', padding: '16px 0 10px', borderBottom: '1px solid var(--border-subtle)', position: 'relative' }}>
          {(!currentStats.trafficTrend || currentStats.trafficTrend.length === 0) ? (
            <div style={{ width: '100%', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem', alignSelf: 'center' }}>
              No website visitors recorded yet. Page views will display here live in real-time as users visit your site!
            </div>
          ) : (
            currentStats.trafficTrend.map((item, idx) => {
              const views = item.totalViews || 0;
              const heightPct = views === 0 ? 0 : Math.min(100, Math.max(12, (views / maxViews) * 100));

              return (
                <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', height: '100%', justifyContent: 'flex-end' }}>
                  <div style={{ fontSize: '0.74rem', color: views > 0 ? 'var(--accent-cyan)' : 'var(--text-muted)', fontWeight: 700 }}>
                    {views}
                  </div>
                  <div
                    style={{
                      width: '100%',
                      maxWidth: '38px',
                      height: views === 0 ? '4px' : `${heightPct}%`,
                      background: views === 0 ? 'var(--border-subtle)' : 'linear-gradient(to top, var(--accent-blue), var(--accent-cyan))',
                      borderRadius: '6px 6px 0 0',
                      transition: 'all 0.3s ease',
                      boxShadow: views > 0 ? '0 0 12px rgba(56, 189, 248, 0.25)' : 'none',
                    }}
                  />
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>{item._id}</div>
                </div>
              );
            })
          )}
        </div>
      </div>

    </div>
  );
}


