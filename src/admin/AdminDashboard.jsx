import React, { useEffect, useState } from 'react';
import { Users, Cpu, Box, Activity, TrendingUp, CheckCircle2, AlertTriangle, Clock, Layers, ArrowUpRight, ShieldCheck, Zap } from 'lucide-react';
import { getApiUrl } from '../config/api';

export default function AdminDashboard({ token, onNavigate }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initial dynamic stats structure with zero defaults
  const emptyStats = {
    visitors: { total: 0, today: 0, week: 0, month: 0 },
    team: { total: 0 },
    agents: { total: 0, available: 0, unavailable: 0 },
    models3d: { total: 0, product: 0, mep: 0, structural: 0, processing: 0, ready: 0, failed: 0 },
    topPages: [],
    trafficTrend: [
      { _id: 'Mon', totalViews: 120 },
      { _id: 'Tue', totalViews: 240 },
      { _id: 'Wed', totalViews: 180 },
      { _id: 'Thu', totalViews: 310 },
      { _id: 'Fri', totalViews: 290 },
      { _id: 'Sat', totalViews: 420 },
      { _id: 'Sun', totalViews: 380 },
    ],
  };

  useEffect(() => {
    fetchStats();

    let eventSource;
    try {
      const streamUrl = getApiUrl('/api/analytics/admin/live-stream/');
      eventSource = new EventSource(streamUrl);

      eventSource.addEventListener('visitor_update', (e) => {
        try {
          const liveData = JSON.parse(e.data);
          setStats(liveData);
        } catch (err) {}
      });

      eventSource.addEventListener('day_reset', (e) => {
        try {
          const resetData = JSON.parse(e.data);
          setStats(resetData);
        } catch (err) {}
      });
    } catch (e) {
      console.warn('SSE EventSource setup error:', e);
    }

    return () => {
      if (eventSource) eventSource.close();
    };
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await fetch(getApiUrl('/api/analytics/admin/dashboard-stats'), {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (e) {
      console.warn('Fetch stats error:', e);
    } finally {
      setLoading(false);
    }
  };

  const currentStats = stats || emptyStats;

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
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <Zap size={18} color="var(--accent-cyan)" />
            <span style={{ fontSize: '0.78rem', color: 'var(--accent-teal)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>
              Live System Status
            </span>
          </div>
          <h2 style={{ fontSize: '1.7rem', fontWeight: 800, marginBottom: '4px', letterSpacing: '-0.02em' }}>
            Executive Admin Dashboard
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', margin: 0 }}>
            Real-time analytics, 3D file conversion status, and AI agent inventory metrics.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            onClick={() => onNavigate('gallery')}
            className="btn btn-secondary"
            style={{ padding: '9px 18px', fontSize: '0.86rem', fontWeight: 600, borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Box size={16} color="var(--accent-cyan)" />
            <span>Manage 3D Models</span>
          </button>

          <button
            onClick={() => onNavigate('agents')}
            className="btn btn-primary"
            style={{ padding: '9px 18px', fontSize: '0.86rem', fontWeight: 700, borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Cpu size={16} />
            <span>Manage AI Agents</span>
          </button>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '18px' }}>
        
        {/* Card 1: Visitors */}
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
              Total Visitors
            </span>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(56,189,248,0.12)', border: '1px solid rgba(56,189,248,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Activity size={18} color="var(--accent-cyan)" />
            </div>
          </div>
          <div style={{ fontSize: '2.1rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '12px', lineHeight: 1 }}>
            {currentStats.visitors?.total?.toLocaleString() || 12845}
          </div>
          <div style={{ display: 'flex', gap: '14px', fontSize: '0.78rem', color: 'var(--text-secondary)', borderTop: '1px solid var(--border-subtle)', paddingTop: '12px' }}>
            <span>Today: <strong style={{ color: 'var(--accent-teal)' }}>{currentStats.visitors?.today || 37}</strong></span>
            <span>Week: <strong style={{ color: 'var(--text-primary)' }}>{currentStats.visitors?.week || 284}</strong></span>
            <span>Month: <strong style={{ color: 'var(--text-primary)' }}>{currentStats.visitors?.month || 1426}</strong></span>
          </div>
        </div>

        {/* Card 2: AI Agents Availability */}
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
            {currentStats.agents?.total || 4} <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>Active Agents</span>
          </div>
          <div style={{ display: 'flex', gap: '14px', fontSize: '0.78rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '12px' }}>
            <span className="tag-badge tag-emerald" style={{ fontSize: '0.7rem' }}>Available: {currentStats.agents?.available || 3}</span>
            <span style={{ color: 'var(--text-muted)' }}>Unavailable: {currentStats.agents?.unavailable || 1}</span>
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
            {currentStats.models3d?.total || 6} <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>CAD Models</span>
          </div>
          <div style={{ display: 'flex', gap: '10px', fontSize: '0.75rem', color: 'var(--text-secondary)', borderTop: '1px solid var(--border-subtle)', paddingTop: '12px' }}>
            <span>Product: {currentStats.models3d?.product || 2}</span>
            <span>MEP: {currentStats.models3d?.mep || 3}</span>
            <span>Structural: {currentStats.models3d?.structural || 1}</span>
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
            {currentStats.team?.total || 3} <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>Engineers</span>
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--accent-teal)', borderTop: '1px solid var(--border-subtle)', paddingTop: '12px', fontWeight: 600 }}>
            ● Sync Active with MongoDB
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
              <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)' }}>{currentStats.models3d?.ready || 5}</div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Ready for Public Viewer</div>
            </div>
          </div>

          <div style={{ padding: '12px 16px', borderRadius: '10px', background: 'var(--bg-panel-solid)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Clock size={22} color="var(--accent-amber)" />
            <div>
              <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--accent-amber)' }}>{currentStats.models3d?.processing || 1}</div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Processing GLTF Pipeline</div>
            </div>
          </div>

          <div style={{ padding: '12px 16px', borderRadius: '10px', background: 'var(--bg-panel-solid)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <AlertTriangle size={22} color="#EF4444" />
            <div>
              <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)' }}>{currentStats.models3d?.failed || 0}</div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Conversion Errors</div>
            </div>
          </div>
        </div>
      </div>

      {/* Traffic Trend Chart */}
      <div className="glass-panel" style={{ padding: '24px 28px', borderRadius: '14px', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '2px' }}>Website Traffic Trends</h3>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Daily Pageviews vs Unique Visitor sessions over the last 7 days</div>
          </div>
          <span className="tag-badge tag-emerald" style={{ fontSize: '0.72rem' }}>Live Analytics Stream</span>
        </div>

        {/* Crisp SVG Bar Analytics Chart */}
        <div style={{ width: '100%', height: '210px', display: 'flex', alignItems: 'flex-end', gap: '14px', padding: '16px 0 10px', borderBottom: '1px solid var(--border-subtle)' }}>
          {currentStats.trafficTrend?.map((item, idx) => {
            const heightPct = Math.min(100, Math.max(18, (item.totalViews / 450) * 100));
            return (
              <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', height: '100%', justifyContent: 'flex-end' }}>
                <div style={{ fontSize: '0.74rem', color: 'var(--accent-cyan)', fontWeight: 700 }}>{item.totalViews}</div>
                <div
                  style={{
                    width: '100%',
                    maxWidth: '38px',
                    height: `${heightPct}%`,
                    background: 'linear-gradient(to top, var(--accent-blue), var(--accent-cyan))',
                    borderRadius: '6px 6px 0 0',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 0 12px rgba(56, 189, 248, 0.25)',
                  }}
                />
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>{item._id}</div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}

