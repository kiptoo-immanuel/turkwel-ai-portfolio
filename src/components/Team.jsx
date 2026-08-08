import React, { useState, useEffect } from 'react';
import { Compass, Cpu, Flame, Shield, Award, CheckCircle2, FileText, Download } from 'lucide-react';

export default function Team() {
  const [members, setMembers] = useState([]);

  const defaultMembers = [
    {
      _id: 'm1',
      name: 'Emmanuel Kiptoo, PE',
      position: 'Lead Design Engineer & Thermal Automation Director',
      biography: 'Licensed Professional Engineer (PE) specializing in mechanical design engineering, HVAC systems, and thermal fluids. Leads our Product Development and BMS HVAC energy optimization agent division.',
      profileImage: '/assets/team-placeholder.jpg',
      qualifications: ['Licensed PE (Mechanical & Design)', 'Certified REVIT MEP Expert', 'Fluid & Thermal Dynamics'],
      profilePdf: null,
    },
    {
      _id: 'm2',
      name: 'Elena Rostova, AIA',
      position: 'Chief Architect & Spatial AI Lead',
      biography: 'Licensed Architect with 14+ years designing high-density commercial towers and complex healthcare facilities. Pioneers our BIM parametric agents and automated code compliance models.',
      profileImage: '/assets/team-placeholder.jpg',
      qualifications: ['Licensed Architect', 'Revit Computational Expert', 'Ph.D. Spatial Informatics'],
      profilePdf: null,
    },
    {
      _id: 'm3',
      name: 'Dr. Aris Thorne',
      position: 'Head of Autonomous AI Systems',
      biography: 'Former DeepMind researcher specializing in multi-agent reinforcement learning and computer vision for spatial threat detection and automated physical product design.',
      profileImage: '/assets/team-placeholder.jpg',
      qualifications: ['Ph.D. Autonomous Robotics', '12+ Patents in Generative CAD', 'BMS Edge AI Specialist'],
    },
  ];

  useEffect(() => {
    fetchTeam();
  }, []);

  const fetchTeam = async () => {
    try {
      const res = await fetch('/api/team/public');
      if (res.ok) {
        const data = await res.json();
        setMembers(data && data.length > 0 ? data : defaultMembers);
      } else {
        setMembers(defaultMembers);
      }
    } catch (e) {
      setMembers(defaultMembers);
    }
  };

  const activeTeamList = members.length > 0 ? members : defaultMembers;

  return (
    <section id="team" style={{ padding: '100px 0', position: 'relative' }}>
      <div className="container">
        
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto 60px' }}>
          <span className="tag-badge tag-amber" style={{ marginBottom: '16px' }}>
            <Award size={14} /> Multi-Disciplinary Expertise
          </span>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', marginBottom: '18px' }}>
            Led by Licensed <span className="gradient-text">Architects & Design Engineers</span>
          </h2>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>
            We do not just write AI code—our core team comprises registered Architects, licensed Professional Engineers (PE), and AI Researchers working side-by-side to guarantee real-world physical compliance.
          </p>
        </div>

        {/* Team Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '28px',
          }}
        >
          {activeTeamList.map((member) => (
            <div key={member._id} className="glass-panel" style={{ padding: '32px', position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                  <div
                    style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: '14px',
                      overflow: 'hidden',
                      border: '1px solid var(--border-subtle)',
                    }}
                  >
                    <img src={member.profileImage || '/assets/team-placeholder.jpg'} alt={member.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <span className="tag-badge" style={{ fontSize: '0.72rem' }}>
                    Engineering Lead
                  </span>
                </div>

                <h3 style={{ fontSize: '1.3rem', marginBottom: '4px' }}>{member.name}</h3>
                <div style={{ fontSize: '0.88rem', color: 'var(--accent-cyan)', fontWeight: 600, marginBottom: '16px' }}>
                  {member.position}
                </div>

                <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', marginBottom: '24px', lineHeight: 1.6 }}>
                  {member.biography}
                </p>
              </div>

              <div>
                {/* Qualifications */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)', marginBottom: member.profilePdf?.url ? '16px' : '0' }}>
                  {member.qualifications?.map((cred, cIdx) => (
                    <div key={cIdx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      <CheckCircle2 size={14} color="#10B981" />
                      <span>{cred}</span>
                    </div>
                  ))}
                </div>

                {/* PDF Download Button - Rendered only if PDF uploaded */}
                {member.profilePdf && member.profilePdf.url && (
                  <a
                    href={member.profilePdf.url}
                    download
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-secondary"
                    style={{
                      width: '100%',
                      padding: '10px',
                      fontSize: '0.84rem',
                      borderColor: 'rgba(16, 185, 129, 0.4)',
                      color: '#10B981',
                      background: 'rgba(16, 185, 129, 0.08)',
                    }}
                  >
                    <Download size={14} />
                    <span>Download Profile PDF</span>
                  </a>
                )}
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
