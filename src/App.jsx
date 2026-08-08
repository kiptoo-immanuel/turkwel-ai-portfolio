import React, { useState, useEffect } from 'react';
import CanvasGrid from './components/CanvasGrid';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import Gallery from './components/Gallery';
import AgentSimulator from './components/AgentSimulator';
import Team from './components/Team';
import CaseStudies from './components/CaseStudies';
import RoiCalculator from './components/RoiCalculator';
import Footer from './components/Footer';
import ContactModal from './components/ContactModal';
import ScrollToTop from './components/ScrollToTop';
import AdminPortal from './admin/AdminPortal';
import { getApiUrl } from './config/api';

export default function App() {
  const [currentView, setCurrentView] = useState('site'); // 'site' or 'admin'
  const [isProposalModalOpen, setIsProposalModalOpen] = useState(false);

  // Light / Dark Theme State
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('bimaxis_theme') || 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('bimaxis_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // URL routing for Admin Portal access via secret URL: /#admin, /#/admin, or /admin
  useEffect(() => {
    const handleUrlRoute = () => {
      const hash = (window.location.hash || '').toLowerCase();
      const path = (window.location.pathname || '').toLowerCase();

      if (hash === '#admin' || hash === '#/admin' || path.endsWith('/admin')) {
        setCurrentView('admin');
      } else {
        setCurrentView('site');
      }
    };

    handleUrlRoute();

    window.addEventListener('hashchange', handleUrlRoute);
    window.addEventListener('popstate', handleUrlRoute);

    return () => {
      window.removeEventListener('hashchange', handleUrlRoute);
      window.removeEventListener('popstate', handleUrlRoute);
    };
  }, []);

  // Automatic real-time pageview tracking on initial load & section navigation
  useEffect(() => {
    const trackPageView = () => {
      if (currentView === 'site') {
        try {
          let sessionId = localStorage.getItem('visitor_session_id');
          if (!sessionId) {
            sessionId = `session_${Math.random().toString(36).substring(2)}_${Date.now()}`;
            localStorage.setItem('visitor_session_id', sessionId);
          }
          fetch(getApiUrl('/api/analytics/public/track/'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              page: window.location.hash || '/',
              sessionId,
              referrer: document.referrer || 'direct',
            }),
          }).catch(() => {});
        } catch (e) {
          // Ignore analytics fetch errors
        }
      }
    };

    trackPageView();
    window.addEventListener('hashchange', trackPageView);
    return () => window.removeEventListener('hashchange', trackPageView);
  }, [currentView]);

  const handleOpenProposal = () => setIsProposalModalOpen(true);
  const handleCloseProposal = () => setIsProposalModalOpen(false);

  const handleBackToSite = () => {
    window.location.hash = '';
    setCurrentView('site');
  };

  if (currentView === 'admin') {
    return <AdminPortal onBackToSite={handleBackToSite} theme={theme} onToggleTheme={toggleTheme} />;
  }

  return (
    <div style={{ position: 'relative', minHeight: '100vh', background: 'var(--bg-dark)' }}>
      {/* Interactive Background Canvas */}
      <CanvasGrid />

      {/* Header Navbar */}
      <Navbar onOpenProposal={handleOpenProposal} theme={theme} onToggleTheme={toggleTheme} />

      {/* Main Content */}
      <main style={{ position: 'relative', zIndex: 1 }}>
        <Hero onOpenProposal={handleOpenProposal} />
        <Services onOpenProposal={handleOpenProposal} />
        <Gallery />
        <AgentSimulator />
        <Team />
        <CaseStudies onOpenProposal={handleOpenProposal} />
        <RoiCalculator onOpenProposal={handleOpenProposal} />
      </main>

      {/* Footer */}
      <Footer onOpenProposal={handleOpenProposal} />

      {/* Proposal Request Modal */}
      <ContactModal isOpen={isProposalModalOpen} onClose={handleCloseProposal} />

      {/* Floating Scroll To Top Button */}
      <ScrollToTop />
    </div>
  );
}
