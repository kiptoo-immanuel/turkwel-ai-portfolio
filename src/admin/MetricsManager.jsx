import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, CheckCircle2, X, TrendingUp, Database, Flame, Cpu, Building2, BarChart3, Zap, ShieldCheck } from 'lucide-react';
import { getApiUrl } from '../config/api';

const ICON_MAP = {
  Flame: Flame,
  Cpu: Cpu,
  Building2: Building2,
  BarChart3: BarChart3,
  TrendingUp: TrendingUp,
  Zap: Zap,
  ShieldCheck: ShieldCheck,
};

const CATEGORIES = [
  'MEPF AI Agents',
  'Product Development Agents',
  'Business Analytics AI Agents',
];

export default function MetricsManager({ token }) {
  const [metrics, setMetrics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMetric, setEditingMetric] = useState(null);
  const [notification, setNotification] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState('All');

  const [formData, setFormData] = useState({
    title: '',
    category: 'MEPF AI Agents',
    description: '',
    performanceGain: '',
    benchmarkOutcome: '',
    tags: '',
    iconName: 'Flame',
    color: '#F59E0B',
    isPublished: true,
    order: 0,
  });

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchMetrics();
  }, []);

  const showNotification = (msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      const res = await fetch(getApiUrl('/api/metrics/admin/all/'), {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setMetrics(Array.isArray(data) ? data : []);
      } else {
        setMetrics([]);
      }
    } catch (e) {
      console.error('Failed to fetch performance metrics:', e);
      setMetrics([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingMetric(null);
    setFormData({
      title: '',
      category: 'MEPF AI Agents',
      description: '',
      performanceGain: '-35.0% Energy Use',
      benchmarkOutcome: '$250,000 / year',
      tags: 'BACnet, Predictive CFD',
      iconName: 'Flame',
      color: '#F59E0B',
      isPublished: true,
      order: 0,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingMetric(item);
    setFormData({
      title: item.title || '',
      category: item.category || 'MEPF AI Agents',
      description: item.description || '',
      performanceGain: item.performanceGain || item.performance_gain || '',
      benchmarkOutcome: item.benchmarkOutcome || item.benchmark_outcome || '',
      tags: Array.isArray(item.tags) ? item.tags.join(', ') : item.tags || '',
      iconName: item.iconName || item.icon_name || 'Flame',
      color: item.color || '#F59E0B',
      isPublished: item.isPublished ?? item.is_published ?? true,
      order: item.order ?? 0,
    });
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!id) return;
    if (!window.confirm('Are you sure you want to delete this performance metric project?')) return;

    try {
      const res = await fetch(getApiUrl(`/api/metrics/admin/${id}/`), {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        showNotification('Metric deleted & MongoDB updated.');
        fetchMetrics();
      } else {
        showNotification('Failed to delete metric.', 'error');
      }
    } catch (e) {
      console.error('Delete metric error:', e);
      showNotification('Delete request error.', 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload = {
        title: formData.title,
        category: formData.category,
        description: formData.description,
        performanceGain: formData.performanceGain,
        benchmarkOutcome: formData.benchmarkOutcome,
        tags: formData.tags,
        iconName: formData.iconName,
        color: formData.color,
        isPublished: formData.isPublished,
        order: Number(formData.order) || 0,
      };

      const metricId = editingMetric ? (editingMetric.id || editingMetric._id) : null;
      const path = metricId ? `/api/metrics/admin/${metricId}/` : '/api/metrics/admin/';
      const method = metricId ? 'PUT' : 'POST';

      const res = await fetch(getApiUrl(path), {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setModalOpen(false);
        showNotification(metricId ? 'Metric updated & synced to MongoDB.' : 'Metric created & synced to MongoDB.');
        fetchMetrics();
      } else {
        showNotification('Error saving metric.', 'error');
      }
    } catch (e) {
      console.error('Save error:', e);
      showNotification('Save request failed.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredMetrics = categoryFilter === 'All'
    ? metrics
    : metrics.filter((m) => m.category === categoryFilter);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      
      {/* Toast Notification */}
      {notification && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 1200,
            padding: '12px 20px',
            borderRadius: '10px',
            background: notification.type === 'error' ? 'rgba(239, 68, 68, 0.95)' : 'rgba(16, 185, 129, 0.95)',
            color: '#FFF',
            fontWeight: 700,
            fontSize: '0.9rem',
            boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <CheckCircle2 size={18} />
          <span>{notification.msg}</span>
        </div>
      )}

      {/* Header Banner */}
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
          borderRadius: '16px',
          border: '1px solid var(--border-subtle)',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <Database size={18} color="var(--accent-teal)" />
            <span style={{ fontSize: '0.78rem', color: 'var(--accent-teal)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>
              MongoDB Database Sync Active
            </span>
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '4px', letterSpacing: '-0.02em' }}>
            Proven Performance Metrics Management
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', margin: 0 }}>
            Manage real-world impact case studies across MEPF AI Agents, Product Development Agents, and Business Analytics AI Agents.
          </p>
        </div>

        <button onClick={handleOpenAdd} className="btn btn-primary" style={{ padding: '10px 22px', borderRadius: '10px', fontWeight: 700 }}>
          <Plus size={18} />
          <span>Add Proven Metric</span>
        </button>
      </div>

      {/* Category Tabs */}
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        {['All', ...CATEGORIES].map((cat) => {
          const isActive = categoryFilter === cat;
          return (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              style={{
                padding: '8px 16px',
                borderRadius: '20px',
                border: isActive ? '1px solid var(--accent-cyan)' : '1px solid var(--border-subtle)',
                background: isActive ? 'rgba(56, 189, 248, 0.15)' : 'var(--bg-panel-solid)',
                color: isActive ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                fontWeight: isActive ? 700 : 500,
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Table */}
      <div className="glass-panel" style={{ overflowX: 'auto', padding: '0', borderRadius: '14px' }}>
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
            Loading Performance Metrics...
          </div>
        ) : filteredMetrics.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
            No metrics found under <strong>"{categoryFilter}"</strong>. Click <strong>"Add Proven Metric"</strong> to create one!
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ background: 'var(--bg-panel-solid)', borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '16px 24px' }}>Project Title</th>
                <th style={{ padding: '16px' }}>Category</th>
                <th style={{ padding: '16px' }}>Performance Gain</th>
                <th style={{ padding: '16px' }}>Benchmark Outcome</th>
                <th style={{ padding: '16px' }}>Status</th>
                <th style={{ padding: '16px 24px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMetrics.map((item, idx) => {
                const metricId = item.id || item._id;
                const IconComponent = ICON_MAP[item.iconName] || TrendingUp;
                return (
                  <tr key={metricId || idx} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    
                    {/* Title */}
                    <td style={{ padding: '16px 24px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div
                          style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '8px',
                            background: 'rgba(255,255,255,0.05)',
                            border: `1px solid ${item.color || 'var(--accent-cyan)'}40`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                          }}
                        >
                          <IconComponent size={18} color={item.color || 'var(--accent-cyan)'} />
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{item.title}</div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                            {Array.isArray(item.tags) ? item.tags.join(' • ') : item.tags}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td style={{ padding: '16px' }}>
                      <span
                        style={{
                          fontSize: '0.78rem',
                          fontWeight: 600,
                          padding: '4px 10px',
                          borderRadius: '6px',
                          background: 'rgba(255,255,255,0.05)',
                          color: item.color || 'var(--accent-cyan)',
                          border: `1px solid ${item.color || 'var(--accent-cyan)'}30`,
                        }}
                      >
                        {item.category}
                      </span>
                    </td>

                    {/* Performance Gain */}
                    <td style={{ padding: '16px', fontWeight: 800, color: item.color || '#F59E0B' }}>
                      {item.performanceGain}
                    </td>

                    {/* Benchmark Outcome */}
                    <td style={{ padding: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {item.benchmarkOutcome}
                    </td>

                    {/* Status */}
                    <td style={{ padding: '16px' }}>
                      <span className={`tag-badge ${item.isPublished ? 'tag-emerald' : ''}`} style={{ fontSize: '0.72rem' }}>
                        {item.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </td>

                    {/* Actions */}
                    <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px' }}>
                        <button onClick={() => handleOpenEdit(item)} className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.82rem', borderRadius: '8px' }}>
                          <Edit size={14} />
                          <span>Edit</span>
                        </button>
                        <button onClick={() => handleDelete(metricId)} className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.82rem', borderRadius: '8px', borderColor: 'rgba(239,68,68,0.3)', color: '#F87171' }}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal Form */}
      {modalOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1100, background: 'rgba(4,6,10,0.85)', backdropFilter: 'blur(20px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '680px', padding: '36px', border: '1px solid var(--border-glow)', maxHeight: '90vh', overflowY: 'auto', borderRadius: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{editingMetric ? 'Edit Proven Performance Metric' : 'Add Proven Performance Metric'}</h3>
              <button onClick={() => setModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={22} />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px', fontWeight: 600 }}>Project Title *</label>
                  <input type="text" required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="e.g. 52-Story High-Rise Thermal Retrofit" style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px', fontWeight: 600 }}>Agent Category *</label>
                  <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)' }}>
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px', fontWeight: 600 }}>Project Scope & Impact Description *</label>
                <textarea rows={3} required value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Describe how the AI agent optimized energy, structural weight, or BIM clashes..." style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', fontFamily: 'inherit' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px', fontWeight: 600 }}>Performance Gain *</label>
                  <input type="text" required value={formData.performanceGain} onChange={(e) => setFormData({ ...formData, performanceGain: e.target.value })} placeholder="e.g. -38.4% Energy Use or -31.2% Mass" style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px', fontWeight: 600 }}>Benchmark Outcome *</label>
                  <input type="text" required value={formData.benchmarkOutcome} onChange={(e) => setFormData({ ...formData, benchmarkOutcome: e.target.value })} placeholder="e.g. $320,000 / year or 6 Weeks Speedup" style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)' }} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px', fontWeight: 600 }}>Icon</label>
                  <select value={formData.iconName} onChange={(e) => setFormData({ ...formData, iconName: e.target.value })} style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)' }}>
                    {Object.keys(ICON_MAP).map((ic) => (
                      <option key={ic} value={ic}>{ic}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px', fontWeight: 600 }}>Theme Accent Color</label>
                  <input type="color" value={formData.color} onChange={(e) => setFormData({ ...formData, color: e.target.value })} style={{ width: '100%', height: '42px', padding: '4px', borderRadius: '8px', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', cursor: 'pointer' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px', fontWeight: 600 }}>Display Order</label>
                  <input type="number" value={formData.order} onChange={(e) => setFormData({ ...formData, order: e.target.value })} style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)' }} />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px', fontWeight: 600 }}>Tech Stack Tags (comma separated)</label>
                <input type="text" value={formData.tags} onChange={(e) => setFormData({ ...formData, tags: e.target.value })} placeholder="BACnet Protocol, Niagara Framework, Predictive CFD" style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)' }} />
              </div>

              {/* Published Switch */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input type="checkbox" id="pubSwitchMetrics" checked={formData.isPublished} onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })} />
                <label htmlFor="pubSwitchMetrics" style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: 600 }}>Publish on Public Website</label>
              </div>

              <button type="submit" disabled={submitting} className="btn btn-primary" style={{ padding: '14px', fontSize: '1rem', marginTop: '10px', fontWeight: 700 }}>
                <span>{submitting ? 'Syncing to Database...' : editingMetric ? 'Update Metric & Sync MongoDB' : 'Create Metric & Sync MongoDB'}</span>
              </button>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
