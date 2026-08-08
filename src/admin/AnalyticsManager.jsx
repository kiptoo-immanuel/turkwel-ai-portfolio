import React, { useState, useEffect } from 'react';
import { Activity, Eye, Users, Layers, ArrowUpRight, ShieldCheck } from 'lucide-react';
import { getApiUrl } from '../config/api';

export default function AnalyticsManager({ token }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();

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

  const fetchAnalytics = async () => {
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
      console.error('Fetch analytics error:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleResetAnalytics = async () => {
    if (!window.confirm('Reset all pageviews and visitor analytics database records to 0?')) return;
    try {
      const res = await fetch(getApiUrl('/api/analytics/admin/reset/'), {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setStats(data.stats);
        alert('All pageviews and visitor analytics have been reset to 0.');
      }
    } catch (e) {
      console.error('Reset analytics error:', e);
    }
  };

  const currentVisitors = stats?.visitors || { total: 0, today: 0, week: 0, month: 0 };
  const topPagesList = stats?.topPages || [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', marginBottom: '4px' }}>Website Visitor Analytics</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.94rem' }}>
            Real-time visitor session tracking, daily/weekly/monthly analytics from database records.
          </p>
        </div>
        <button
          onClick={handleResetAnalytics}
          className="btn btn-secondary"
          style={{ padding: '8px 18px', fontSize: '0.84rem', borderColor: 'rgba(239, 68, 68, 0.4)', color: '#F87171' }}
        >
          <span>Reset All Pageviews to 0</span>
        </button>
      </div>

      {/* Stats Overview Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '8px' }}>
            Today's Visitors
          </div>
          <div style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>
            {currentVisitors.today || 0}
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '8px' }}>
            This Week
          </div>
          <div style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--accent-teal)' }}>
            {currentVisitors.week || 0}
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '8px' }}>
            This Month
          </div>
          <div style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            {currentVisitors.month || 0}
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '8px' }}>
            All Time Pageviews
          </div>
          <div style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--accent-amber)' }}>
            {(currentVisitors.total || 0).toLocaleString()}
          </div>
        </div>
      </div>

      {/* Top Pages List */}
      <div className="glass-panel" style={{ padding: '28px' }}>
        <h3 style={{ fontSize: '1.25rem', marginBottom: '20px' }}>Most Visited Site Sections</h3>

        {topPagesList.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {topPagesList.map((p, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', background: 'rgba(15,23,42,0.6)', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Eye size={18} color="var(--accent-cyan)" />
                  <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{p._id || '/'}</span>
                </div>
                <span style={{ fontWeight: 800, color: 'var(--accent-teal)' }}>{(p.count || 0).toLocaleString()} views</span>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center', padding: '20px 0' }}>
            No page visits recorded yet. As visitors view your website, live page breakdown will appear here.
          </div>
        )}
      </div>

    </div>
  );
}
