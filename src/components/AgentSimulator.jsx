import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, CheckCircle, Flame, Building2, Cpu, Droplets, Terminal, Activity, ArrowRight, Zap } from 'lucide-react';

export default function AgentSimulator() {
  const [selectedAgent, setSelectedAgent] = useState('hvac');
  const [isRunning, setIsRunning] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [logs, setLogs] = useState([]);

  const agentWorkflows = {
    hvac: {
      name: 'HVAC Agents ', //Thermal Load Balancer Agent',
      icon: Flame,
      color: '#F59E0B',
      description: 'Reads real-time occupancy & solar radiation telemetry to micro-adjust chilled water valves and VFD air handlers.',
      steps: [
        { label: 'Connecting to BACnet / Tridium BMS Gateway', metric: 'Latency: 12ms', status: 'done' },
        { label: 'Ingesting 450+ Temperature & Humidity Sensors', metric: '450 Nodes Synced', status: 'done' },
        { label: 'Running Predictive Thermal Fluid Dynamics Model', metric: 'Simulating 2hr Horizon', status: 'done' },
        { label: 'Detecting Over-Cooled Zone (Floor 14 East Wing)', metric: 'Delta T: -3.8°C', status: 'done' },
        { label: 'Modulating VFD Fan Speed to 62% & Rebalancing Valve', metric: 'Energy Saved: 38.4kW', status: 'done' },
      ],
      resultMetric: '38.4 kW Saved',
      efficiencyGain: '+41.2% Energy Efficiency',
    },
    plumbing: {
      name: 'Plumbing Agents', // & Hydraulic Leak & Pressure Agent',
      icon: Droplets,
      color: '#2BEB09',
      description: 'Monitors acoustic vibration & differential pressure across riser pipes to isolate micro-leaks and balance domestic booster pumps.',
      steps: [
        { label: 'Scanning Ultrasonic Flow Transducers on Riser B', metric: '128 Sensors Online', status: 'done' },
        { label: 'Calculating Friction Loss & Velocity Gradient (Hazen-Williams)', metric: 'Flow Rate: 240 GPM', status: 'done' },
        { label: 'Micro-Leak Anomaly Detected in Riser 4 Sub-Branch', metric: 'Pressure Drop: 4.2 PSI', status: 'done' },
        { label: 'Actuating Smart Solenoid Isolation Valve #18', metric: 'Leak Isolated in 420ms', status: 'done' },
        { label: 'Auto-Scheduling Legionella Flush Cycle & Dispatching Tech Alert', metric: 'Building Compliance Verified', status: 'done' },
      ],
      resultMetric: 'Leak Isolated in 420ms',
      efficiencyGain: 'Zero Damage Sustained',
    },
    bim: {
      name: 'BIM Clash', // & Building Code Auditor Agent',
      icon: Building2,
      color: '#38BDF8',
      description: 'Parses IFC 3D geometry to identify MEP ductwork vs structural beam clashes and verifies ADA door clearances.',
      steps: [
        { label: 'Ingesting IFC 4.3 Structural & MEP Spatial Models', metric: '2.4M Triangles Parsed', status: 'done' },
        { label: 'Running Spatial Octree Collision Analysis', metric: 'Zero Boundary Misses', status: 'done' },
        { label: 'Hard Clash Detected: Duct 104 Intersects Steel I-Beam #42', metric: 'Intersection Depth: 45mm', status: 'done' },
        { label: 'Synthesizing Re-Routing Vector (Parametric Shift -80mm Z-Axis)', metric: 'Code Clearances Validated', status: 'done' },
        { label: 'Auto-Generating Revised Revit IFC Component & COBie Tag', metric: 'BIM Model Updated', status: 'done' },
      ],
      resultMetric: '0 Severe Clashes Remaining',
      efficiencyGain: '4.5 Hours Saved',
    },
    product: {
      name: 'Generative CAD & DFM Optimization Agent',
      icon: Cpu,
      color: '#F61FFD',
      description: 'Generates lightweight topological CAD meshes and verifies CNC milling tool path accessibility.',
      steps: [
        { label: 'Importing STEP File & Initial Stress Boundary Conditions', metric: 'Load Target: 15,000N', status: 'done' },
        { label: 'Running Finite Element Stress Mesh Analysis (FEA)', metric: 'Max Von Mises: 180 MPa', status: 'done' },
        { label: 'Executing Topology Lattice Thinning Algorithm', metric: '32% Weight Reduction', status: 'done' },
        { label: 'Verifying 5-Axis CNC Tooling Clearance & Under-cuts', metric: 'Zero Tool Gouging', status: 'done' },
        { label: 'Generating Final STEP CAD Geometry & Instant Supplier Quote', metric: 'DFM Certified', status: 'done' },
      ],
      resultMetric: '-34% Component Weight',
      efficiencyGain: '100% DFM Compliant',
    },
  };

  const currentWorkflow = agentWorkflows[selectedAgent];

  const handleRunSimulator = () => {
    setIsRunning(true);
    setStepIndex(0);
    setLogs([`[0.00s] Initializing ${currentWorkflow.name}...`]);
  };

  useEffect(() => {
    let timer;
    if (isRunning && stepIndex < currentWorkflow.steps.length) {
      timer = setTimeout(() => {
        const nextStep = currentWorkflow.steps[stepIndex];
        setLogs((prev) => [...prev, `[${((stepIndex + 1) * 0.85).toFixed(2)}s] ${nextStep.label} (${nextStep.metric})`]);
        setStepIndex((prev) => prev + 1);
      }, 1000);
    } else if (isRunning && stepIndex >= currentWorkflow.steps.length) {
      setIsRunning(false);
      setLogs((prev) => [...prev, `[COMPLETED] Agent Workflow Executed Successfully. Outcome: ${currentWorkflow.resultMetric}`]);
    }
    return () => clearTimeout(timer);
  }, [isRunning, stepIndex, selectedAgent]);

  const IconComp = currentWorkflow.icon;

  return (
    <section id="simulator" style={{ padding: '100px 0', background: 'rgba(11, 15, 25, 0.4)', position: 'relative' }}>
      <div className="container">
        
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 50px' }}>
          <span className="tag-badge tag-amber" style={{ marginBottom: '16px' }}>
            <Activity size={14} /> Interactive Live Sandbox
          </span>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', marginBottom: '18px' }}>
            Experience Our <span className="gradient-text">AI Agent Logic</span> in Real-Time
          </h2>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>
            Select an engineering domain below and watch the agent ingest parameters, run spatial/thermal modeling, and execute automated actions.
          </p>
        </div>

        {/* Sandbox Window */}
        <div className="glass-panel" style={{ padding: '36px', border: `1px solid ${currentWorkflow.color}40` }}>
          
          {/* Agent Selection Buttons */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '36px' }}>
            {Object.keys(agentWorkflows).map((key) => {
              const item = agentWorkflows[key];
              const ItemIcon = item.icon;
              const isSelected = selectedAgent === key;
              return (
                <button
                  key={key}
                  onClick={() => {
                    setSelectedAgent(key);
                    setStepIndex(0);
                    setIsRunning(false);
                    setLogs([]);
                  }}
                  style={{
                    background: isSelected ? 'rgba(30, 41, 59, 0.9)' : 'rgba(15, 23, 42, 0.5)',
                    border: `1px solid ${isSelected ? item.color : 'var(--border-subtle)'}`,
                    borderRadius: '12px',
                    padding: '20px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: isSelected ? `0 0 20px ${item.color}30` : 'none',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                    <ItemIcon size={22} color={item.color} />
                    <span style={{ fontWeight: 700, fontSize: '1.02rem', color: isSelected ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                      {item.name.split(' ')[0]} {item.name.split(' ')[1]}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{item.description}</div>
                </button>
              );
            })}
          </div>

          {/* Execution Panel Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }} className="sandbox-grid">
            
            {/* Left: Workflow Steps */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <IconComp size={22} color={currentWorkflow.color} />
                  <h4 style={{ fontSize: '1.15rem' }}>{currentWorkflow.name}</h4>
                </div>
                <button
                  onClick={handleRunSimulator}
                  disabled={isRunning}
                  className="btn btn-primary"
                  style={{ padding: '8px 20px', fontSize: '0.88rem', opacity: isRunning ? 0.6 : 1 }}
                >
                  {isRunning ? <Zap size={16} className="floating" /> : <Play size={16} />}
                  <span>{isRunning ? 'Executing Agent...' : 'Run Simulation'}</span>
                </button>
              </div>

              {/* Steps List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {currentWorkflow.steps.map((step, idx) => {
                  const isCompleted = idx < stepIndex;
                  const isCurrent = idx === stepIndex && isRunning;
                  return (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '14px 18px',
                        borderRadius: '10px',
                        background: isCurrent
                          ? 'rgba(56, 189, 248, 0.12)'
                          : isCompleted
                          ? 'rgba(16, 185, 129, 0.08)'
                          : 'var(--bg-card)',
                        border: `1px solid ${
                          isCurrent
                            ? 'var(--accent-cyan)'
                            : isCompleted
                            ? 'rgba(16, 185, 129, 0.3)'
                            : 'var(--border-subtle)'
                        }`,
                        transition: 'all 0.3s ease',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div
                          style={{
                            width: '24px',
                            height: '24px',
                            borderRadius: '50%',
                            background: isCompleted ? '#10B981' : isCurrent ? 'var(--accent-cyan)' : 'rgba(148,163,184,0.2)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#000',
                            fontSize: '0.75rem',
                            fontWeight: 800,
                          }}
                        >
                          {isCompleted ? <CheckCircle size={14} color="#FFF" /> : idx + 1}
                        </div>
                        <span style={{ fontSize: '0.9rem', color: isCompleted || isCurrent ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                          {step.label}
                        </span>
                      </div>
                      <span style={{ fontSize: '0.78rem', color: currentWorkflow.color, fontWeight: 700 }}>
                        {step.metric}
                      </span>
                    </div>
                  );
                })}
              </div>

            </div>

            {/* Right: Terminal Console Output */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                  <Terminal size={16} color="var(--accent-cyan)" />
                  <span>AGENT LOG TELEMETRY</span>
                </div>
                <div style={{ fontSize: '0.78rem', color: '#10B981', fontWeight: 700 }}>
                  ● WebSocket Streaming
                </div>
              </div>

              {/* Console Output Area */}
              <div
                style={{
                  flex: 1,
                  minHeight: '260px',
                  background: '#04060A',
                  borderRadius: '10px',
                  padding: '18px',
                  fontFamily: 'monospace',
                  fontSize: '0.82rem',
                  color: '#38BDF8',
                  border: '1px solid var(--border-subtle)',
                  overflowY: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                }}
              >
                {logs.length === 0 ? (
                  <div style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>
                    Click "Run Simulation" above to initialize live agent telemetry stream...
                  </div>
                ) : (
                  logs.map((log, i) => (
                    <div key={i} style={{ opacity: 0.95 }}>
                      {log}
                    </div>
                  ))
                )}
              </div>

              {/* Simulation Result Metric Card */}
              {stepIndex >= currentWorkflow.steps.length && (
                <div
                  style={{
                    marginTop: '16px',
                    padding: '16px 20px',
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(56, 189, 248, 0.15))',
                    border: '1px solid rgba(16, 185, 129, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '0.75rem', color: '#10B981', fontWeight: 700 }}>AGENT EXECUTION SUCCESSFUL</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>{currentWorkflow.resultMetric}</div>
                  </div>
                  <span className="tag-badge tag-emerald">{currentWorkflow.efficiencyGain}</span>
                </div>
              )}

            </div>

          </div>

        </div>

      </div>

      <style>{`
        @media (max-width: 900px) {
          .sandbox-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
