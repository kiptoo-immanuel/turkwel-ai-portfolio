// API Configuration Helper for BIMAXISGroup (Django REST Framework Backend)

export const getApiUrl = (endpoint) => {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  
  // If custom backend URL is configured in Vite environment
  if (import.meta.env.VITE_API_URL) {
    const base = import.meta.env.VITE_API_URL.replace(/\/$/, '');
    return `${base}${cleanEndpoint}`;
  }

  // If running locally (localhost or 127.0.0.1)
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    // Port 8000 is default Django REST Framework backend
    return `http://localhost:8000${cleanEndpoint}`;
  }

  // Live static deployment (e.g. GitHub Pages) fallback to relative path
  return cleanEndpoint;
};
