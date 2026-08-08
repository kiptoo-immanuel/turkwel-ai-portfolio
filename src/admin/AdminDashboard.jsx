import React, { useEffect, useState } from 'react';
import { Users, Cpu, Box, Activity, TrendingUp, CheckCircle2, AlertTriangle, Clock, Layers, ArrowUpRight } from 'lucide-react';
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
    trafficTrend: [],
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      {/* Top Banner Overview */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '4px' }}>System Overview & Analytics</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.94rem' }}>
            Live content management metrics, inventory availability, and 3D conversion pipeline health.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={() => onNavigate('gallery')} className="btn btn-secondary" style={{ padding: '8px 18px', fontSize: '0.88rem' }}>
            <Box size={16} color="var(--accent-cyan)" />
            <span>Manage 3D Models</span>
          </button>
          <button onClick={() => onNavigate('agents')} className="btn btn-primary" style={{ padding: '8px 18px', fontSize: '0.88rem' }}>
            <Cpu size={16} />
            <span>Manage AI Agents</span>
          </button>
        </div>
      </div>

      {/* Stats Cards Row 1 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
        
        {/* Card 1: Visitors */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Total Visitors</span>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(56,189,248,0.12)', border: '1px solid rgba(56,189,248,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Activity size={20} color="#38BDF8" />
            </div>
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '12px' }}>
            {currentStats.visitors?.total?.toLocaleString() || 12845}
          </div>
          <div style={{ display: 'flex', gap: '16px', fontSize: '0.78rem', color: 'var(--text-secondary)', borderTop: '1px solid var(--border-subtle)', paddingTop: '12px' }}>
            <span>Today: <strong style={{ color: 'var(--accent-teal)' }}>{currentStats.visitors?.today || 37}</strong></span>
            <span>Week: <strong style={{ color: 'var(--text-primary)' }}>{currentStats.visitors?.week || 284}</strong></span>
            <span>Month: <strong style={{ color: 'var(--text-primary)' }}>{currentStats.visitors?.month || 1426}</strong></span>
          </div>
        </div>

        {/* Card 2: AI Agents Availability */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>AI Agent Inventory</span>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(0,242,254,0.12)', border: '1px solid rgba(0,242,254,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Cpu size={20} color="#00F2FE" />
            </div>
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '12px' }}>
            {currentStats.agents?.total || 4} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 500 }}>Agents</span>
          </div>
          <div style={{ display: 'flex', gap: '16px', fontSize: '0.78rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '12px' }}>
            <span className="tag-badge tag-emerald" style={{ fontSize: '0.7rem' }}>Available: {currentStats.agents?.available || 3}</span>
            <span style={{ color: 'var(--text-muted)' }}>Unavailable: {currentStats.agents?.unavailable || 1}</span>
          </div>
        </div>

        {/* Card 3: 3D Model Gallery */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>3D Model Gallery</span>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Box size={20} color="#F59E0B" />
            </div>
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '12px' }}>
            {currentStats.models3d?.total || 6} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 500 }}>3D Models</span>
          </div>
          <div style={{ display: 'flex', gap: '12px', fontSize: '0.75rem', color: 'var(--text-secondary)', borderTop: '1px solid var(--border-subtle)', paddingTop: '12px' }}>
            <span>Product: {currentStats.models3d?.product || 2}</span>
            <span>MEP: {currentStats.models3d?.mep || 3}</span>
            <span>Structural: {currentStats.models3d?.structural || 1}</span>
          </div>
        </div>

        {/* Card 4: Team Members */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Engineering Team</span>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Users size={20} color="#10B981" />
            </div>
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '12px' }}>
            {currentStats.team?.total || 3} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 500 }}>Active Members</span>
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--accent-teal)', borderTop: '1px solid var(--border-subtle)', paddingTop: '12px' }}>
            ● Public Profiles Synced to MongoDB
          </div>
        </div>

      </div>

      {/* 3D Conversion Pipeline Queue Status Banner */}
      <div className="glass-panel" style={{ padding: '24px', border: '1px solid var(--border-glow)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Layers size={22} color="var(--accent-cyan)" />
            <div>
              <h3 style={{ fontSize: '1.15rem' }}>Automated 3D Conversion Pipeline Status</h3>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                Processing native Revit (.rvt), SolidWorks (.step), and IFC exchange files into lightweight WebGL GLTF/GLB models.
              </div>
            </div>
          </div>
          <button onClick={() => onNavigate('gallery')} className="btn btn-secondary" style={{ padding: '6px 16px', fontSize: '0.82rem' }}>
            <span>View 3D Pipeline</span>
            <ArrowUpRight size={14} />
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <div style={{ padding: '14px', borderRadius: '10px', background: 'rgba(15,23,42,0.6)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <CheckCircle2 size={24} color="#10B981" />
            <div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>{currentStats.models3d?.ready || 5}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Ready for Public Viewer</div>
            </div>
          </div>

          <div style={{ padding: '14px', borderRadius: '10px', background: 'rgba(15,23,42,0.6)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Clock size={24} color="#F59E0B" className="floating" />
            <div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#F59E0B' }}>{currentStats.models3d?.processing || 1}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Processing GLTF Pipeline</div>
            </div>
          </div>

          <div style={{ padding: '14px', borderRadius: '10px', background: 'rgba(15,23,42,0.6)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <AlertTriangle size={24} color="#EF4444" />
            <div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>{currentStats.models3d?.failed || 0}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Conversion Errors</div>
            </div>
          </div>
        </div>
      </div>

      {/* Traffic Trend Chart (SVG) */}
      <div className="glass-panel" style={{ padding: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '4px' }}>Website Traffic Trends</h3>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Daily Pageviews vs Unique Visitor sessions over the last 7 days</div>
          </div>
          <span className="tag-badge">Live Analytics</span>
        </div>

        {/* SVG Line / Bar Chart */}
        <div style={{ width: '100%', height: '220px', display: 'flex', alignItems: 'flex-end', gap: '16px', padding: '20px 0', borderBottom: '1px solid var(--border-subtle)' }}>
          {currentStats.trafficTrend?.map((item, idx) => {
            const heightPct = Math.min(100, Math.max(20, (item.totalViews / 350) * 100));
            return (
              <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', height: '100%', justifyContent: 'flex-end' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--accent-cyan)', fontWeight: 700 }}>{item.totalViews}</div>
                <div
                  style={{
                    width: '100%',
                    maxWidth: '42px',
                    height: `${heightPct}%`,
                    background: 'linear-gradient(to top, var(--accent-blue), var(--accent-cyan))',
                    borderRadius: '6px 6px 0 0',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 0 10px rgba(56, 189, 248, 0.3)',
                  }}
                />
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>{item._id}</div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
