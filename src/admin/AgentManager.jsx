import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Cpu, DollarSign, Check, X, Layers, Tag, Eye } from 'lucide-react';
import { getApiUrl } from '../config/api';

export default function AgentManager({ token }) {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [agentModalOpen, setAgentModalOpen] = useState(false);
  const [editingAgent, setEditingAgent] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    shortDescription: '',
    fullDescription: '',
    category: 'built-environment',
    features: '',
    benefits: '',
    demoUrl: '',
    documentationUrl: '',
    purchaseUrl: '',
    published: true,
    available: true,
  });

  const [imageFile, setImageFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Pricing Plan Modal state
  const [pricingModalOpen, setPricingModalOpen] = useState(false);
  const [selectedAgentForPricing, setSelectedAgentForPricing] = useState(null);
  const [planForm, setPlanForm] = useState({
    planName: 'Professional',
    price: 99,
    currency: 'USD',
    billingType: 'one_time',
  });

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      setLoading(true);
      const res = await fetch(getApiUrl('/api/agents/admin/all'), {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setAgents(data);
      }
    } catch (e) {
      console.error('Fetch agents error:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddAgent = () => {
    setEditingAgent(null);
    setFormData({
      name: '',
      shortDescription: '',
      fullDescription: '',
      category: 'built-environment',
      features: '',
      benefits: '',
      demoUrl: '',
      documentationUrl: '',
      purchaseUrl: '',
      published: true,
      available: true,
    });
    setImageFile(null);
    setAgentModalOpen(true);
  };

  const handleOpenEditAgent = (agent) => {
    setEditingAgent(agent);
    setFormData({
      name: agent.name || '',
      shortDescription: agent.shortDescription || '',
      fullDescription: agent.fullDescription || '',
      category: agent.category || 'built-environment',
      features: Array.isArray(agent.features) ? agent.features.join(', ') : '',
      benefits: Array.isArray(agent.benefits) ? agent.benefits.join(', ') : '',
      demoUrl: agent.demoUrl || '',
      documentationUrl: agent.documentationUrl || '',
      purchaseUrl: agent.purchaseUrl || '',
      published: agent.status?.published ?? true,
      available: agent.status?.available ?? true,
    });
    setImageFile(null);
    setAgentModalOpen(true);
  };

  const handleDeleteAgent = async (id) => {
    if (!window.confirm('Delete this AI Agent and all associated pricing plans?')) return;
    try {
      const res = await fetch(`/api/agents/admin/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) fetchAgents();
    } catch (e) {
      console.error('Delete agent error:', e);
    }
  };

  const handleAgentSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('shortDescription', formData.shortDescription);
      data.append('fullDescription', formData.fullDescription);
      data.append('category', formData.category);
      data.append('features', formData.features);
      data.append('benefits', formData.benefits);
      data.append('demoUrl', formData.demoUrl);
      data.append('documentationUrl', formData.documentationUrl);
      data.append('purchaseUrl', formData.purchaseUrl);
      data.append('published', formData.published);
      data.append('available', formData.available);

      if (imageFile) data.append('image', imageFile);

      const url = editingAgent ? `/api/agents/admin/${editingAgent._id}` : '/api/agents/admin';
      const method = editingAgent ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: data,
      });

      if (res.ok) {
        setAgentModalOpen(false);
        fetchAgents();
      }
    } catch (e) {
      console.error('Agent save error:', e);
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Pricing Plans
  const handleOpenAddPricing = (agent) => {
    setSelectedAgentForPricing(agent);
    setPlanForm({ planName: 'Professional Plan', price: 99, currency: 'USD', billingType: 'one_time' });
    setPricingModalOpen(true);
  };

  const handleAddPricingSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/agents/admin/${selectedAgentForPricing._id}/pricing`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(planForm),
      });

      if (res.ok) {
        setPricingModalOpen(false);
        fetchAgents();
      }
    } catch (e) {
      console.error('Add pricing error:', e);
    }
  };

  const handleDeletePricing = async (planId) => {
    try {
      const res = await fetch(`/api/agents/admin/pricing/${planId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) fetchAgents();
    } catch (e) {
      console.error('Delete pricing error:', e);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', marginBottom: '4px' }}>AI Agents & Pricing Management</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.94rem' }}>
            Add, update, or unpublish AI Agents and configure multi-tier pricing plans (One-time, Monthly, Custom).
          </p>
        </div>
        <button onClick={handleOpenAddAgent} className="btn btn-primary" style={{ padding: '10px 22px' }}>
          <Plus size={18} />
          <span>Add New AI Agent</span>
        </button>
      </div>

      {/* Agents Table */}
      <div className="glass-panel" style={{ overflowX: 'auto', padding: '0' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
          <thead>
            <tr style={{ background: 'rgba(15, 23, 42, 0.8)', borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
              <th style={{ padding: '16px 24px' }}>AI Agent</th>
              <th style={{ padding: '16px' }}>Category</th>
              <th style={{ padding: '16px' }}>Pricing Plans</th>
              <th style={{ padding: '16px' }}>Availability</th>
              <th style={{ padding: '16px 24px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {agents.map((agent) => (
              <tr key={agent._id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                
                <td style={{ padding: '16px 24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '10px', overflow: 'hidden', border: '1px solid var(--border-subtle)' }}>
                      <img src={agent.image || '/assets/hvac_bim.jpg'} alt={agent.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{agent.name}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{agent.shortDescription}</div>
                    </div>
                  </div>
                </td>

                <td style={{ padding: '16px' }}>
                  <span className="tag-badge" style={{ fontSize: '0.72rem' }}>{agent.category}</span>
                </td>

                {/* Plans linked */}
                <td style={{ padding: '16px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {agent.plans && agent.plans.length > 0 ? (
                      agent.plans.map((p) => (
                        <div key={p._id} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', color: 'var(--text-primary)' }}>
                          <span style={{ fontWeight: 700, color: 'var(--accent-teal)' }}>${p.price}</span>
                          <span>{p.planName} ({p.billingType})</span>
                          <button onClick={() => handleDeletePricing(p._id)} style={{ background: 'none', border: 'none', color: '#F87171', cursor: 'pointer', padding: '0 4px' }}>×</button>
                        </div>
                      ))
                    ) : (
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>No plans created</span>
                    )}
                    <button onClick={() => handleOpenAddPricing(agent)} style={{ background: 'none', border: 'none', color: 'var(--accent-cyan)', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', textAlign: 'left', marginTop: '2px' }}>
                      + Add Pricing Plan
                    </button>
                  </div>
                </td>

                <td style={{ padding: '16px' }}>
                  <span className={`tag-badge ${agent.status?.available ? 'tag-emerald' : 'tag-amber'}`} style={{ fontSize: '0.72rem' }}>
                    {agent.status?.available ? 'In Stock' : 'Unavailable'}
                  </span>
                </td>

                <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px' }}>
                    <button onClick={() => handleOpenEditAgent(agent)} className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.82rem' }}>
                      <Edit size={14} />
                      <span>Edit</span>
                    </button>
                    <button onClick={() => handleDeleteAgent(agent._id)} className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.82rem', borderColor: 'rgba(239,68,68,0.3)', color: '#F87171' }}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Agent Modal */}
      {agentModalOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1100, background: 'rgba(4,6,10,0.85)', backdropFilter: 'blur(20px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '650px', padding: '36px', border: '1px solid var(--border-glow)', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '1.5rem' }}>{editingAgent ? 'Edit AI Agent' : 'Create New AI Agent'}</h3>
              <button onClick={() => setAgentModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={22} />
              </button>
            </div>

            <form onSubmit={handleAgentSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Agent Name *</label>
                <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)' }} />
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Short Description *</label>
                <input type="text" required value={formData.shortDescription} onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })} style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)' }} />
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Full Description</label>
                <textarea rows={3} value={formData.fullDescription} onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })} style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', fontFamily: 'inherit' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Category</label>
                  <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)' }}>
                    <option value="built-environment">Built Environment</option>
                    <option value="product-dev">Product Development</option>
                    <option value="hvac">HVAC Automation</option>
                    <option value="bim">BIM AI Agents</option>
                    <option value="plumbing">Plumbing & Hydraulics</option>
                    <option value="security">Smart Security</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Product Image</label>
                  <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }} />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Features (comma separated)</label>
                <input type="text" value={formData.features} onChange={(e) => setFormData({ ...formData, features: e.target.value })} placeholder="BACnet, Thermal Balancer, Predictive FDD" style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)' }} />
              </div>

              <div style={{ display: 'flex', gap: '24px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                  <input type="checkbox" checked={formData.published} onChange={(e) => setFormData({ ...formData, published: e.target.checked })} />
                  <span>Published</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                  <input type="checkbox" checked={formData.available} onChange={(e) => setFormData({ ...formData, available: e.target.checked })} />
                  <span>Available for Purchase</span>
                </label>
              </div>

              <button type="submit" disabled={submitting} className="btn btn-primary" style={{ padding: '14px', fontSize: '1rem', marginTop: '10px' }}>
                <span>{submitting ? 'Saving Agent...' : editingAgent ? 'Update Agent' : 'Create Agent'}</span>
              </button>

            </form>
          </div>
        </div>
      )}

      {/* Pricing Plan Modal */}
      {pricingModalOpen && selectedAgentForPricing && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1100, background: 'rgba(4,6,10,0.85)', backdropFilter: 'blur(20px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '460px', padding: '32px', border: '1px solid var(--border-glow)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.3rem' }}>Add Pricing Plan for {selectedAgentForPricing.name}</h3>
              <button onClick={() => setPricingModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddPricingSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Plan Name (e.g. Pro Studio)</label>
                <input type="text" required value={planForm.planName} onChange={(e) => setPlanForm({ ...planForm, planName: e.target.value })} style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Price ($ USD)</label>
                  <input type="number" required min="0" value={planForm.price} onChange={(e) => setPlanForm({ ...planForm, price: e.target.value })} style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Billing Type</label>
                  <select value={planForm.billingType} onChange={(e) => setPlanForm({ ...planForm, billingType: e.target.value })} style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)' }}>
                    <option value="free">Free</option>
                    <option value="one_time">One-time Purchase</option>
                    <option value="monthly">Monthly Subscription</option>
                    <option value="annual">Annual Subscription</option>
                    <option value="custom">Custom Pricing</option>
                  </select>
                </div>
              </div>

              <button type="submit" className="btn btn-primary" style={{ padding: '12px', fontSize: '0.95rem', marginTop: '10px' }}>
                <span>Save Pricing Plan</span>
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
