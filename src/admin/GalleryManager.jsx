import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Box, RefreshCw, CheckCircle2, AlertTriangle, Clock, Eye, X, Upload, Info } from 'lucide-react';
import ThreeViewer from '../components/ThreeViewer';
import { getApiUrl } from '../config/api';

export default function GalleryManager({ token }) {
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [previewModel, setPreviewModel] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    shortDescription: '',
    fullDescription: '',
    category: 'MEP',
    tags: '',
    isPublished: true,
    isFeatured: false,
  });

  const [cadFile, setCadFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchModels();
  }, []);

  const fetchModels = async () => {
    try {
      setLoading(true);
      const res = await fetch(getApiUrl('/api/gallery/admin/all'), {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setModels(data);
      }
    } catch (e) {
      console.error('Fetch 3D models error:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenUpload = () => {
    setFormData({
      title: '',
      shortDescription: '',
      fullDescription: '',
      category: 'MEP',
      tags: '',
      isPublished: true,
      isFeatured: false,
    });
    setCadFile(null);
    setUploadModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this 3D model and its converted files from the gallery?')) return;
    try {
      const res = await fetch(`/api/gallery/admin/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) fetchModels();
    } catch (e) {
      console.error('Delete 3D model error:', e);
    }
  };

  const handleRetriggerConversion = async (id) => {
    try {
      const res = await fetch(`/api/gallery/admin/${id}/convert`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) fetchModels();
    } catch (e) {
      console.error('Convert retrigger error:', e);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!cadFile) {
      alert('Please select a 3D CAD source file (.step, .fbx, .rvt, .ifc, .glb, .obj).');
      return;
    }

    setSubmitting(true);
    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('shortDescription', formData.shortDescription);
      data.append('fullDescription', formData.fullDescription);
      data.append('category', formData.category);
      data.append('tags', formData.tags);
      data.append('isPublished', formData.isPublished);
      data.append('isFeatured', formData.isFeatured);
      data.append('file', cadFile);

      const res = await fetch('/api/gallery/admin', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: data,
      });

      if (res.ok) {
        setUploadModalOpen(false);
        fetchModels();
      }
    } catch (e) {
      console.error('Upload 3D model error:', e);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', marginBottom: '4px' }}>3D Model Gallery & Conversion Pipeline</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.94rem' }}>
            Upload Revit (.rvt), SolidWorks (.step), and exchange CAD files. Automatically process into WebGL GLTF/GLB models.
          </p>
        </div>
        <button onClick={handleOpenUpload} className="btn btn-primary" style={{ padding: '10px 22px' }}>
          <Upload size={18} />
          <span>Upload 3D Model</span>
        </button>
      </div>

      {/* Format Compatibility Guide Info Banner */}
      <div className="glass-panel" style={{ padding: '20px 24px', border: '1px solid var(--border-glow)', display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
        <Info size={22} color="var(--accent-cyan)" style={{ flexShrink: 0, marginTop: '2px' }} />
        <div style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          <strong style={{ color: 'var(--text-primary)' }}>Supported 3D Format Workflow:</strong>
          <br />
          • <strong style={{ color: 'var(--accent-teal)' }}>Direct Web GLB/GLTF</strong>: Ready instantly without server conversion.
          <br />
          • <strong style={{ color: 'var(--accent-cyan)' }}>CAD Interchange (.STEP, .STP, .IGES, .FBX, .OBJ, .IFC)</strong>: Auto-queued for background GLTF pipeline conversion.
          <br />
          • <strong style={{ color: 'var(--accent-amber)' }}>Native Revit (.RVT) / SolidWorks (.SLDPRT)</strong>: Export as .IFC, .FBX, or .STEP for optimal conversion fidelity.
        </div>
      </div>

      {/* 3D Models Data Table */}
      <div className="glass-panel" style={{ overflowX: 'auto', padding: '0' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
          <thead>
            <tr style={{ background: 'rgba(15, 23, 42, 0.8)', borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
              <th style={{ padding: '16px 24px' }}>3D Model Title</th>
              <th style={{ padding: '16px' }}>Category</th>
              <th style={{ padding: '16px' }}>Source Format</th>
              <th style={{ padding: '16px' }}>Conversion Status</th>
              <th style={{ padding: '16px' }}>Public Status</th>
              <th style={{ padding: '16px 24px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {models.map((model) => (
              <tr key={model._id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                
                <td style={{ padding: '16px 24px' }}>
                  <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{model.title}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{model.shortDescription}</div>
                </td>

                <td style={{ padding: '16px' }}>
                  <span className="tag-badge" style={{ fontSize: '0.72rem' }}>{model.category}</span>
                </td>

                <td style={{ padding: '16px' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--accent-teal)', fontWeight: 700, textTransform: 'uppercase' }}>
                    .{model.sourceFile?.format || 'cad'}
                  </span>
                </td>

                {/* Conversion Status Badge */}
                <td style={{ padding: '16px' }}>
                  {model.conversionStatus === 'ready' && (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: '#10B981', background: 'rgba(16,185,129,0.1)', padding: '4px 10px', borderRadius: '6px', border: '1px solid rgba(16,185,129,0.3)', fontWeight: 600 }}>
                      <CheckCircle2 size={14} /> Ready
                    </span>
                  )}

                  {model.conversionStatus === 'processing' && (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: '#F59E0B', background: 'rgba(245,158,11,0.1)', padding: '4px 10px', borderRadius: '6px', border: '1px solid rgba(245,158,11,0.3)', fontWeight: 600 }}>
                      <Clock size={14} className="floating" /> Processing GLTF
                    </span>
                  )}

                  {model.conversionStatus === 'failed' && (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: '#F87171', background: 'rgba(239,68,68,0.1)', padding: '4px 10px', borderRadius: '6px', border: '1px solid rgba(239,68,68,0.3)', fontWeight: 600 }}>
                      <AlertTriangle size={14} /> Failed
                    </span>
                  )}

                  {model.conversionStatus === 'uploaded' && (
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Uploaded</span>
                  )}
                </td>

                <td style={{ padding: '16px' }}>
                  <span className={`tag-badge ${model.isPublished ? 'tag-emerald' : ''}`} style={{ fontSize: '0.72rem' }}>
                    {model.isPublished ? 'Published' : 'Draft'}
                  </span>
                </td>

                <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
                    <button onClick={() => setPreviewModel(model)} className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.82rem' }}>
                      <Eye size={14} />
                      <span>Preview 3D</span>
                    </button>
                    <button onClick={() => handleRetriggerConversion(model._id)} className="btn btn-secondary" title="Re-trigger GLTF conversion" style={{ padding: '6px 10px', fontSize: '0.82rem' }}>
                      <RefreshCw size={14} />
                    </button>
                    <button onClick={() => handleDelete(model._id)} className="btn btn-secondary" style={{ padding: '6px 10px', fontSize: '0.82rem', borderColor: 'rgba(239,68,68,0.3)', color: '#F87171' }}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Upload 3D Modal */}
      {uploadModalOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1100, background: 'rgba(4,6,10,0.85)', backdropFilter: 'blur(20px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '650px', padding: '36px', border: '1px solid var(--border-glow)', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '1.5rem' }}>Upload New 3D CAD Model</h3>
              <button onClick={() => setUploadModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={22} />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Model Title *</label>
                <input type="text" required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)' }} />
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Short Description *</label>
                <input type="text" required value={formData.shortDescription} onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })} style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Engineering Category</label>
                  <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)' }}>
                    <option value="Product">Product Engineering</option>
                    <option value="MEP">MEP & HVAC Systems</option>
                    <option value="Structural">Structural Steel & Concrete</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Tags (comma separated)</label>
                  <input type="text" value={formData.tags} onChange={(e) => setFormData({ ...formData, tags: e.target.value })} placeholder="Revit, HVAC, CAD" style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)' }} />
                </div>
              </div>

              {/* CAD File Selector */}
              <div style={{ padding: '20px', borderRadius: '10px', background: 'rgba(15,23,42,0.6)', border: '1px dashed var(--border-glow)', textAlign: 'center' }}>
                <Upload size={32} color="var(--accent-cyan)" style={{ margin: '0 auto 10px' }} />
                <div style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: 600, marginBottom: '4px' }}>Select 3D File (.step, .fbx, .obj, .ifc, .rvt, .glb)</div>
                <input type="file" required onChange={(e) => setCadFile(e.target.files[0])} style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }} />
              </div>

              <div style={{ display: 'flex', gap: '24px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                  <input type="checkbox" checked={formData.isPublished} onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })} />
                  <span>Publish to Public 3D Gallery</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                  <input type="checkbox" checked={formData.isFeatured} onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })} />
                  <span>Feature on Gallery Top</span>
                </label>
              </div>

              <button type="submit" disabled={submitting} className="btn btn-primary" style={{ padding: '14px', fontSize: '1rem', marginTop: '10px' }}>
                <span>{submitting ? 'Uploading & Queuing Conversion...' : 'Upload & Process 3D Model'}</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Admin 3D Preview Modal */}
      {previewModel && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1100, background: 'rgba(4,6,10,0.9)', backdropFilter: 'blur(20px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '800px', padding: '32px', border: '1px solid var(--border-glow)', position: 'relative' }}>
            <button onClick={() => setPreviewModel(null)} style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', zIndex: 10 }}>
              <X size={22} />
            </button>
            <h3 style={{ fontSize: '1.4rem', marginBottom: '16px' }}>{previewModel.title} (Admin WebGL Inspector)</h3>
            <ThreeViewer modelUrl={previewModel.convertedFile?.url} title={previewModel.title} />
          </div>
        </div>
      )}

    </div>
  );
}
