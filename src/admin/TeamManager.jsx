import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, FileText, Upload, CheckCircle2, X, Eye, FileUp, Sparkles } from 'lucide-react';
import { getApiUrl } from '../config/api';

export default function TeamManager({ token }) {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    position: '',
    biography: '',
    email: '',
    phone: '',
    linkedin: '',
    website: '',
    skills: '',
    qualifications: '',
    isPublished: true,
  });

  const [imageFile, setImageFile] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [removePdf, setRemovePdf] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const res = await fetch(getApiUrl('/api/team/admin/all'), {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setMembers(data);
      }
    } catch (e) {
      console.error('Failed to fetch team members:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingMember(null);
    setFormData({
      name: '',
      position: '',
      biography: '',
      email: '',
      phone: '',
      linkedin: '',
      website: '',
      skills: '',
      qualifications: '',
      isPublished: true,
    });
    setImageFile(null);
    setPdfFile(null);
    setRemovePdf(false);
    setModalOpen(true);
  };

  const handleOpenEdit = (member) => {
    setEditingMember(member);
    setFormData({
      name: member.name || '',
      position: member.position || '',
      biography: member.biography || '',
      email: member.email || '',
      phone: member.phone || '',
      linkedin: member.linkedin || '',
      website: member.website || '',
      skills: Array.isArray(member.skills) ? member.skills.join(', ') : '',
      qualifications: Array.isArray(member.qualifications) ? member.qualifications.join(', ') : '',
      isPublished: member.isPublished,
    });
    setImageFile(null);
    setPdfFile(null);
    setRemovePdf(false);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this team member profile?')) return;

    try {
      const res = await fetch(getApiUrl(`/api/team/admin/${id}`), {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        fetchMembers();
      }
    } catch (e) {
      console.error('Delete error:', e);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('position', formData.position);
      data.append('biography', formData.biography);
      data.append('email', formData.email);
      data.append('phone', formData.phone);
      data.append('linkedin', formData.linkedin);
      data.append('website', formData.website);
      data.append('skills', formData.skills);
      data.append('qualifications', formData.qualifications);
      data.append('isPublished', formData.isPublished);

      if (imageFile) data.append('image', imageFile);
      if (pdfFile) data.append('pdf', pdfFile);
      if (removePdf) data.append('removePdf', 'true');

      const path = editingMember ? `/api/team/admin/${editingMember._id}` : '/api/team/admin';
      const method = editingMember ? 'PUT' : 'POST';

      const res = await fetch(getApiUrl(path), {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: data,
      });

      if (res.ok) {
        setModalOpen(false);
        fetchMembers();
      }
    } catch (e) {
      console.error('Save error:', e);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', marginBottom: '4px' }}>Engineering Team Management</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.94rem' }}>
            Add, update, or remove Architects & Design Engineers. Upload downloadable PDF credentials for public profiles.
          </p>
        </div>
        <button onClick={handleOpenAdd} className="btn btn-primary" style={{ padding: '10px 22px' }}>
          <Plus size={18} />
          <span>Add Team Member</span>
        </button>
      </div>

      {/* Team Table */}
      <div className="glass-panel" style={{ overflowX: 'auto', padding: '0' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
          <thead>
            <tr style={{ background: 'rgba(15, 23, 42, 0.8)', borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
              <th style={{ padding: '16px 24px' }}>Member</th>
              <th style={{ padding: '16px' }}>Position</th>
              <th style={{ padding: '16px' }}>Profile PDF</th>
              <th style={{ padding: '16px' }}>Status</th>
              <th style={{ padding: '16px 24px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member) => (
              <tr key={member._id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                
                {/* Photo & Name */}
                <td style={{ padding: '16px 24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{ width: '44px', height: '44px', borderRadius: '10px', overflow: 'hidden', border: '1px solid var(--border-subtle)' }}>
                      <img src={member.profileImage || '/assets/team-placeholder.jpg'} alt={member.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{member.name}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{member.email || 'No email specified'}</div>
                    </div>
                  </div>
                </td>

                <td style={{ padding: '16px', color: 'var(--accent-cyan)', fontWeight: 600 }}>{member.position}</td>

                {/* Profile PDF badge */}
                <td style={{ padding: '16px' }}>
                  {member.profilePdf && member.profilePdf.url ? (
                    <a
                      href={member.profilePdf.url}
                      target="_blank"
                      rel="noreferrer"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: '#10B981', background: 'rgba(16,185,129,0.1)', padding: '4px 10px', borderRadius: '6px', border: '1px solid rgba(16,185,129,0.3)', textDecoration: 'none' }}
                    >
                      <FileText size={14} />
                      <span>{member.profilePdf.fileName || 'PDF Attached'}</span>
                    </a>
                  ) : (
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>None</span>
                  )}
                </td>

                <td style={{ padding: '16px' }}>
                  <span className={`tag-badge ${member.isPublished ? 'tag-emerald' : ''}`} style={{ fontSize: '0.72rem' }}>
                    {member.isPublished ? 'Published' : 'Draft'}
                  </span>
                </td>

                <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px' }}>
                    <button onClick={() => handleOpenEdit(member)} className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.82rem' }}>
                      <Edit size={14} />
                      <span>Edit</span>
                    </button>
                    <button onClick={() => handleDelete(member._id)} className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.82rem', borderColor: 'rgba(239,68,68,0.3)', color: '#F87171' }}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Form */}
      {modalOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1100, background: 'rgba(4,6,10,0.85)', backdropFilter: 'blur(20px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '650px', padding: '36px', border: '1px solid var(--border-glow)', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '1.5rem' }}>{editingMember ? 'Edit Team Member Profile' : 'Add New Team Member'}</h3>
              <button onClick={() => setModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={22} />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Full Name *</label>
                  <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Position / Job Title *</label>
                  <input type="text" required value={formData.position} onChange={(e) => setFormData({ ...formData, position: e.target.value })} style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)' }} />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Short Biography *</label>
                <textarea rows={3} required value={formData.biography} onChange={(e) => setFormData({ ...formData, biography: e.target.value })} style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', fontFamily: 'inherit' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Email</label>
                  <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>LinkedIn Profile</label>
                  <input type="url" value={formData.linkedin} onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })} style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)' }} />
                </div>
              </div>

              {/* Skills & Qualifications */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Skills (comma separated)</label>
                  <input type="text" value={formData.skills} onChange={(e) => setFormData({ ...formData, skills: e.target.value })} placeholder="BIM, Revit, PE License" style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Qualifications (comma separated)</label>
                  <input type="text" value={formData.qualifications} onChange={(e) => setFormData({ ...formData, qualifications: e.target.value })} placeholder="Licensed PE, Ph.D." style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)' }} />
                </div>
              </div>

              {/* Files Upload Section */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', padding: '16px', background: 'rgba(15,23,42,0.6)', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Profile Photo</label>
                  <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }} />
                </div>

                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Downloadable Profile PDF</label>
                  <input type="file" accept=".pdf" onChange={(e) => { setPdfFile(e.target.files[0]); setRemovePdf(false); }} style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }} />
                  {editingMember && editingMember.profilePdf && (
                    <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <input type="checkbox" id="remPdf" checked={removePdf} onChange={(e) => setRemovePdf(e.target.checked)} />
                      <label htmlFor="remPdf" style={{ fontSize: '0.78rem', color: '#F87171' }}>Remove current PDF</label>
                    </div>
                  )}
                </div>
              </div>

              {/* Published Switch */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input type="checkbox" id="pubSwitch" checked={formData.isPublished} onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })} />
                <label htmlFor="pubSwitch" style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: 600 }}>Publish on Public Team Page</label>
              </div>

              <button type="submit" disabled={submitting} className="btn btn-primary" style={{ padding: '14px', fontSize: '1rem', marginTop: '10px' }}>
                <span>{submitting ? 'Saving Profile...' : editingMember ? 'Update Profile' : 'Create Profile'}</span>
              </button>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
