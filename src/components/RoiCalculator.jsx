import React, { useState } from 'react';
import { Calculator, Check, ArrowRight, DollarSign, Clock, ShieldCheck, Zap } from 'lucide-react';

export default function RoiCalculator({ onOpenProposal }) {
  const [facilitySize, setFacilitySize] = useState(150000); // Sq. Ft.
  const [utilityRate, setUtilityRate] = useState(0.18); // $ per kWh
  const [selectedModules, setSelectedModules] = useState(['hvac', 'bim']);

  const toggleModule = (id) => {
    if (selectedModules.includes(id)) {
      if (selectedModules.length > 1) {
        setSelectedModules(selectedModules.filter((m) => m !== id));
      }
    } else {
      setSelectedModules([...selectedModules, id]);
    }
  };

  // Calculation Logic
  const kwhPerSqFtYear = 14; // Average commercial building consumption
  const totalAnnualKwh = facilitySize * kwhPerSqFtYear;
  
  const hvacSavingsFactor = selectedModules.includes('hvac') ? 0.35 : 0;
  const annualEnergySavedDollars = Math.round(totalAnnualKwh * hvacSavingsFactor * utilityRate);

  const bimHoursSaved = selectedModules.includes('bim') ? Math.round(facilitySize / 250) : 0;
  const productCadHoursSaved = selectedModules.includes('product') ? 480 : 0;
  const securityHoursSaved = selectedModules.includes('security') ? 350 : 0;

  const totalHoursSaved = bimHoursSaved + productCadHoursSaved + securityHoursSaved;
  const engineeringCostSavings = Math.round(totalHoursSaved * 95); // $95/hr avg engineer rate

  const totalAnnualValue = annualEnergySavedDollars + engineeringCostSavings;
  const estimatedPaybackMonths = (totalAnnualValue > 0 ? (28000 / totalAnnualValue) * 12 : 6).toFixed(1);

  return (
    <section id="roi-calculator" style={{ padding: '100px 0', position: 'relative' }}>
      <div className="container">
        
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 60px' }}>
          <span className="tag-badge tag-emerald" style={{ marginBottom: '16px' }}>
            <Calculator size={14} /> Interactive Estimator
          </span>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', marginBottom: '18px' }}>
            Calculate Your <span className="gradient-text">AI Agent ROI</span>
          </h2>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>
            Estimate energy reduction and engineering hour savings based on your facility square footage and agent configuration.
          </p>
        </div>

        {/* Calculator Body Grid */}
        <div className="glass-panel" style={{ padding: '40px', border: '1px solid var(--border-glow)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '48px' }} className="calc-grid">
            
            {/* Inputs Column */}
            <div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '24px' }}>1. Configure Facility & Systems Scope</h3>

              {/* Slider 1: Facility Size */}
              <div style={{ marginBottom: '32px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <label style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                    Building Floor Area / Facility Size
                  </label>
                  <span style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>
                    {facilitySize.toLocaleString()} sq. ft.
                  </span>
                </div>
                <input
                  type="range"
                  min="20000"
                  max="1000000"
                  step="10000"
                  value={facilitySize}
                  onChange={(e) => setFacilitySize(Number(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--accent-cyan)', cursor: 'pointer' }}
                />
              </div>

              {/* Slider 2: Utility Rate */}
              <div style={{ marginBottom: '36px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <label style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                    Average Utility Rate ($ / kWh)
                  </label>
                  <span style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--accent-amber)' }}>
                    ${utilityRate.toFixed(2)} / kWh
                  </span>
                </div>
                <input
                  type="range"
                  min="0.10"
                  max="0.40"
                  step="0.01"
                  value={utilityRate}
                  onChange={(e) => setUtilityRate(Number(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--accent-amber)', cursor: 'pointer' }}
                />
              </div>

              {/* Module Checkboxes */}
              <h4 style={{ fontSize: '1.05rem', marginBottom: '16px', color: 'var(--text-primary)' }}>Select AI Agent Modules</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
                
                <div
                  onClick={() => toggleModule('hvac')}
                  style={{
                    padding: '16px',
                    borderRadius: '10px',
                    border: `1px solid ${selectedModules.includes('hvac') ? '#F59E0B' : 'var(--border-subtle)'}`,
                    background: selectedModules.includes('hvac') ? 'rgba(245, 158, 11, 0.1)' : 'rgba(15, 23, 42, 0.4)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                  }}
                >
                  <div style={{ width: '20px', height: '20px', borderRadius: '4px', background: selectedModules.includes('hvac') ? '#F59E0B' : 'transparent', border: '1px solid #F59E0B', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {selectedModules.includes('hvac') && <Check size={14} color="#000" />}
                  </div>
                  <div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>HVAC Thermal AI</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>-35% Energy Reduction</div>
                  </div>
                </div>

                <div
                  onClick={() => toggleModule('plumbing')}
                  style={{
                    padding: '16px',
                    borderRadius: '10px',
                    border: `1px solid ${selectedModules.includes('plumbing') ? '#06B6D4' : 'var(--border-subtle)'}`,
                    background: selectedModules.includes('plumbing') ? 'rgba(6, 182, 212, 0.1)' : 'rgba(15, 23, 42, 0.4)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                  }}
                >
                  <div style={{ width: '20px', height: '20px', borderRadius: '4px', background: selectedModules.includes('plumbing') ? '#06B6D4' : 'transparent', border: '1px solid #06B6D4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {selectedModules.includes('plumbing') && <Check size={14} color="#000" />}
                  </div>
                  <div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>Plumbing & Hydraulic AI</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Leak Anomaly & Water AI</div>
                  </div>
                </div>

                <div
                  onClick={() => toggleModule('bim')}
                  style={{
                    padding: '16px',
                    borderRadius: '10px',
                    border: `1px solid ${selectedModules.includes('bim') ? '#38BDF8' : 'var(--border-subtle)'}`,
                    background: selectedModules.includes('bim') ? 'rgba(56, 189, 248, 0.1)' : 'rgba(15, 23, 42, 0.4)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                  }}
                >
                  <div style={{ width: '20px', height: '20px', borderRadius: '4px', background: selectedModules.includes('bim') ? '#38BDF8' : 'transparent', border: '1px solid #38BDF8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {selectedModules.includes('bim') && <Check size={14} color="#000" />}
                  </div>
                  <div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>BIM Clash Agent</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Auto Code & MEP Fix</div>
                  </div>
                </div>

                <div
                  onClick={() => toggleModule('product')}
                  style={{
                    padding: '16px',
                    borderRadius: '10px',
                    border: `1px solid ${selectedModules.includes('product') ? '#00F2FE' : 'var(--border-subtle)'}`,
                    background: selectedModules.includes('product') ? 'rgba(0, 242, 254, 0.1)' : 'rgba(15, 23, 42, 0.4)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                  }}
                >
                  <div style={{ width: '20px', height: '20px', borderRadius: '4px', background: selectedModules.includes('product') ? '#00F2FE' : 'transparent', border: '1px solid #00F2FE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {selectedModules.includes('product') && <Check size={14} color="#000" />}
                  </div>
                  <div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>Product CAD AI</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Generative DFM & FEA</div>
                  </div>
                </div>

                <div
                  onClick={() => toggleModule('security')}
                  style={{
                    padding: '16px',
                    borderRadius: '10px',
                    border: `1px solid ${selectedModules.includes('security') ? '#10B981' : 'var(--border-subtle)'}`,
                    background: selectedModules.includes('security') ? 'rgba(16, 185, 129, 0.1)' : 'rgba(15, 23, 42, 0.4)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                  }}
                >
                  <div style={{ width: '20px', height: '20px', borderRadius: '4px', background: selectedModules.includes('security') ? '#10B981' : 'transparent', border: '1px solid #10B981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {selectedModules.includes('security') && <Check size={14} color="#000" />}
                  </div>
                  <div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#FFF' }}>Smart Security AI</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Spatial Computer Vision</div>
                  </div>
                </div>

              </div>
            </div>

            {/* Results Column */}
            <div
              style={{
                background: 'rgba(15, 23, 42, 0.85)',
                borderRadius: '16px',
                padding: '32px',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '24px', color: 'var(--accent-cyan)' }}>Projected Annual ROI Summary</h3>

                {/* Energy Savings Output */}
                <div style={{ marginBottom: '24px', paddingBottom: '20px', borderBottom: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                    HVAC Energy Cost Savings
                  </div>
                  <div style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>
                    ${annualEnergySavedDollars.toLocaleString()} <span style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--text-secondary)' }}>/ yr</span>
                  </div>
                </div>

                {/* Engineering Hours Saved */}
                <div style={{ marginBottom: '24px', paddingBottom: '20px', borderBottom: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                    BIM & Engineering Hours Saved
                  </div>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>
                    {totalHoursSaved.toLocaleString()} <span style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--text-secondary)' }}>hrs / yr</span>
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    ≈ ${engineeringCostSavings.toLocaleString()} in productive engineering bandwidth
                  </div>
                </div>

                {/* Payback Period */}
                <div style={{ marginBottom: '28px' }}>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                    Estimated System Payback Horizon
                  </div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--accent-amber)' }}>
                    {estimatedPaybackMonths} Months
                  </div>
                </div>
              </div>

              <button onClick={onOpenProposal} className="btn btn-primary" style={{ width: '100%', padding: '16px', fontSize: '1rem' }}>
                <span>Request Custom Proposal with ROI Data</span>
                <ArrowRight size={18} />
              </button>

            </div>

          </div>
        </div>

      </div>

      <style>{`
        @media (max-width: 900px) {
          .calc-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
