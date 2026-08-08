import React, { useState, useEffect } from 'react';
import { Box, Layers, Eye, X, Sparkles, Filter, CheckCircle2 } from 'lucide-react';
import ThreeViewer from './ThreeViewer';

export default function Gallery() {
  const [models, setModels] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedModel, setSelectedModel] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fallback models if API offline
  const fallbackModels = [
    {
      _id: 'm1',
      title: 'Commercial HVAC Chiller & Riser Model',
      category: 'MEP',
      shortDescription: 'Parametric 3D MEP equipment layout showing VFD air handler nodes and dual centrifugal chiller piping.',
      sourceFile: { format: 'rvt', fileName: 'commercial_hvac_riser.rvt' },
      convertedFile: { url: '/uploads/converted/sample_hvac.glb' },
      thumbnail: { url: '/assets/hero_building.jpg' },
      tags: ['HVAC', 'Revit MEP', 'Chiller Piping'],
      viewsCount: 142,
    },
    {
      _id: 'm2',
      title: 'Titanium Generative Drone Arm',
      category: 'Product',
      shortDescription: 'Generative CAD structural mesh lightweighted via FEA stress optimization at 31% mass reduction.',
      sourceFile: { format: 'step', fileName: 'generative_drone_arm.step' },
      convertedFile: { url: '/uploads/converted/sample_drone.glb' },
      thumbnail: { url: '/assets/product_cad.jpg' },
      tags: ['Generative CAD', 'SolidWorks', 'FEA'],
      viewsCount: 98,
    },
    {
      _id: 'm3',
      title: 'High-Rise Structural Steel Connection Node',
      category: 'Structural',
      shortDescription: 'Parametric structural beam column splice connection validated for seismic moment loads.',
      sourceFile: { format: 'ifc', fileName: 'steel_moment_connection.ifc' },
      convertedFile: { url: '/uploads/converted/sample_steel.glb' },
      thumbnail: { url: '/assets/hvac_bim.jpg' },
      tags: ['Structural', 'IFC 4.3', 'Moment Joint'],
      viewsCount: 84,
    },
  ];

  useEffect(() => {
    fetchModels();
  }, [activeCategory]);

  const fetchModels = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/gallery/public?category=${activeCategory}`);
      if (res.ok) {
        const data = await res.json();
        setModels(data && data.length > 0 ? data : fallbackModels);
      } else {
        setModels(fallbackModels);
      }
    } catch (e) {
      setModels(fallbackModels);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModel = async (model) => {
    setSelectedModel(model);
    try {
      await fetch(`/api/gallery/public/${model._id}/view`, { method: 'POST' });
    } catch (e) {
      // Ignore
    }
  };

  const categories = ['All', 'Product', 'MEP', 'Structural'];

  const filteredModels =
    activeCategory === 'All'
      ? models
      : models.filter((m) => m.category === activeCategory);

  return (
    <section id="gallery" style={{ padding: '80px 0', background: 'var(--bg-dark)', position: 'relative' }}>
      <div className="container">
        
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto 40px' }}>
          <span className="tag-badge" style={{ marginBottom: '16px' }}>
            <Box size={14} /> Interactive 3D Model Gallery
          </span>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', marginBottom: '18px', color: 'var(--text-primary)' }}>
            Explore Our <span className="gradient-text">3D Engineering Models</span>
          </h2>
          <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)' }}>
            Rotate, zoom, and inspect real parametric Revit MEP, SolidWorks CAD, and Structural models directly in your browser.
          </p>
        </div>

        {/* Filter Bar */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '40px', flexWrap: 'wrap' }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`btn ${activeCategory === cat ? 'btn-primary' : 'btn-secondary'}`}
              style={{ borderRadius: '30px', padding: '8px 20px', fontSize: '0.88rem' }}
            >
              {cat === 'All' ? 'All 3D Models' : `${cat} Engineering`}
            </button>
          ))}
        </div>

        {/* Models Grid (Fully Responsive on Mobile 280px+) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '28px',
          }}
          className="gallery-grid"
        >
          {filteredModels.map((item) => (
            <div
              key={item._id}
              className="glass-panel"
              style={{
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                cursor: 'pointer',
                overflow: 'hidden',
              }}
              onClick={() => handleOpenModel(item)}
            >
              <div>
                {/* Thumbnail Image Container */}
                <div
                  style={{
                    position: 'relative',
                    width: '100%',
                    height: '200px',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    marginBottom: '18px',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  <img
                    src={item.thumbnail?.url || '/assets/hero_building.jpg'}
                    alt={item.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s ease' }}
                    className="gallery-thumb"
                  />

                  {/* Gradient Overlay */}
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, var(--bg-modal-overlay) 0%, transparent 60%)' }} />

                  {/* Badge Overlay */}
                  <div style={{ position: 'absolute', top: '12px', left: '12px' }}>
                    <span className="tag-badge" style={{ fontSize: '0.7rem', padding: '4px 10px', background: 'var(--bg-card)' }}>
                      {item.category}
                    </span>
                  </div>

                  {/* Interactive 3D Inspection Badge */}
                  <div style={{ position: 'absolute', bottom: '12px', left: '12px', right: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: 'var(--accent-cyan)', fontWeight: 700 }}>
                      <Eye size={14} /> Inspect 3D Model
                    </div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.viewsCount || 0} views</span>
                  </div>
                </div>

                <h3 style={{ fontSize: '1.2rem', marginBottom: '10px', color: 'var(--text-primary)' }}>{item.title}</h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: 1.6 }}>
                  {item.shortDescription}
                </p>
              </div>

              {/* Tags Footer */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', paddingTop: '14px', borderTop: '1px solid var(--border-subtle)' }}>
                {item.tags?.map((tag, tIdx) => (
                  <span key={tIdx} style={{ fontSize: '0.72rem', padding: '4px 10px', borderRadius: '6px', background: 'rgba(148,163,184,0.1)', color: 'var(--text-muted)' }}>
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Fully Mobile Responsive Interactive 3D Inspection Modal */}
      {selectedModel && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '12px',
            background: 'var(--bg-modal-overlay)',
            backdropFilter: 'blur(20px)',
          }}
        >
          <div
            className="glass-panel 3d-modal-card"
            style={{
              width: '100%',
              maxWidth: '860px',
              maxHeight: '92vh',
              overflowY: 'auto',
              padding: '24px',
              position: 'relative',
              border: '1px solid var(--border-glow)',
              boxShadow: 'var(--glass-shadow)',
              borderRadius: '20px',
            }}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedModel(null)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-primary)',
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 20,
              }}
            >
              <X size={20} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', flexWrap: 'wrap' }}>
              <span className="tag-badge">{selectedModel.category} Engineering</span>
              <span style={{ fontSize: '0.78rem', color: 'var(--accent-teal)', fontWeight: 700 }}>
                Source Format: .{selectedModel.sourceFile?.format || 'glb'}
              </span>
            </div>

            <h3 style={{ fontSize: 'clamp(1.2rem, 3vw, 1.6rem)', marginBottom: '8px', color: 'var(--text-primary)', paddingRight: '40px' }}>
              {selectedModel.title}
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '20px', lineHeight: 1.5 }}>
              {selectedModel.fullDescription || selectedModel.shortDescription}
            </p>

            {/* Three.js WebGL Interactive Viewer Canvas */}
            <ThreeViewer
              modelUrl={selectedModel.convertedFile?.url}
              title={selectedModel.title}
            />
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 640px) {
          .3d-modal-card {
            padding: 16px !important;
            border-radius: 14px !important;
          }
        }
      `}</style>
    </section>
  );
}
