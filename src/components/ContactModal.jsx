import React, { useState } from 'react';
import { X, Send, CheckCircle2, Cpu, ShieldCheck, Flame, Building2, Sparkles } from 'lucide-react';

export default function ContactModal({ isOpen, onClose }) {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    domain: 'HVAC Automation',
    infrastructure: 'BACnet / BMS',
    notes: '',
  });

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      // Direct Formspree integration to mannykiptoo@gmail.com
      const response = await fetch('https://formspree.io/f/moeaqbvo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          company: formData.company,
          domain: formData.domain,
          infrastructure: formData.infrastructure,
          notes: formData.notes,
          subject: `New BIMAXISGroup Project Inquiry - ${formData.domain} (${formData.name})`,
        }),
      });

      if (response.ok) {
        setSubmitted(true);
      } else {
        const data = await response.json();
        if (data && data.errors) {
          setErrorMessage(data.errors.map((err) => err.message).join(', '));
        } else {
          setErrorMessage('There was a problem submitting your request. Please try again.');
        }
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setErrorMessage('Unable to send request. Please check your network connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setErrorMessage('');
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        background: 'rgba(4, 6, 10, 0.85)',
        backdropFilter: 'blur(20px)',
      }}
    >
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '620px',
          padding: '36px',
          position: 'relative',
          border: '1px solid var(--border-glow)',
          boxShadow: '0 20px 50px rgba(0,0,0,0.8)',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'rgba(255,255,255,0.06)',
            border: 'none',
            color: 'var(--text-secondary)',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <X size={20} />
        </button>

        {!submitted ? (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <Sparkles size={20} color="var(--accent-cyan)" />
              <span className="tag-badge">ENGINEERING AI Consultant</span>
            </div>

            <h3 style={{ fontSize: '1.8rem', marginBottom: '8px' }}>Request AI Agent Proposal</h3>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginBottom: '28px' }}>
              Our Architects & Design Engineers will analyze your technical requirements and construct a tailored agent architecture.
            </p>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sarah Jenkins"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '8px',
                      background: 'var(--bg-input)',
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--text-primary)',
                      fontSize: '0.95rem',
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
                    Work Email *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="sarah@buildingcorp.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '8px',
                      background: 'var(--bg-input)',
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--text-primary)',
                      fontSize: '0.95rem',
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
                    Company / Firm Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Apex Engineering Group"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '8px',
                      background: 'var(--bg-input)',
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--text-primary)',
                      fontSize: '0.95rem',
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
                    Primary AI Domain
                  </label>
                  <select
                    value={formData.domain}
                    onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '8px',
                      background: 'var(--bg-input)',
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--text-primary)',
                      fontSize: '0.95rem',
                    }}
                  >
                    <option value="HVAC Automation">HVAC Automation Agents</option>
                    <option value="Plumbing & Hydraulics">Plumbing & Hydraulic System Agents</option>
                    <option value="BIM AI Agents">BIM AI Agents & Clash Resolution</option>
                    <option value="Product Development">Product Development & Generative CAD</option>
                    <option value="Smart Security">Smart Security Systems & Spatial Vision</option>
                    <option value="Hybrid Full-Suite">Hybrid Built Environment Suite</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
                  Project Description & Existing Tech Stack
                </label>
                <textarea
                  rows={4}
                  placeholder="Tell us about your building square footage, BMS software (BACnet/Tridium), CAD formats (Revit/STEP), or specific AI automation goals..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    background: 'var(--bg-input)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-primary)',
                    fontSize: '0.92rem',
                    fontFamily: 'inherit',
                  }}
                />
              </div>

              {errorMessage && (
                <div style={{ padding: '12px 16px', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.4)', color: '#F87171', fontSize: '0.88rem' }}>
                  {errorMessage}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary"
                style={{ padding: '16px', fontSize: '1.02rem', marginTop: '10px', opacity: isSubmitting ? 0.7 : 1, cursor: isSubmitting ? 'not-allowed' : 'pointer' }}
              >
                <Send size={18} />
                <span>{isSubmitting ? 'Sending Request...' : 'Submit Technical Request'}</span>
              </button>

            </form>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <CheckCircle2 size={36} color="#10B981" />
            </div>

            <h3 style={{ fontSize: '1.8rem', marginBottom: '12px' }}>Proposal Request Received!</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', lineHeight: 1.6 }}>
              Thank you, <strong>{formData.name || 'Engineer'}</strong>. Lead Design Engineer <strong>Emmanuel Kiptoo, PE</strong> and our spatial AI team have received your scope details for <strong>{formData.domain}</strong> and will reach out within 24 hours with an initial agent architecture blueprint.
            </p>

            <button onClick={handleReset} className="btn btn-secondary" style={{ padding: '12px 28px' }}>
              Close Window
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
