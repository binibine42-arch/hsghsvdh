import { useState, useEffect, useRef } from 'react';
import { PortfolioData, Profile, SocialLinks, DesignProject, PdfDocument } from '../types/portfolio';
import { INITIAL_PORTFOLIO_DATA } from '../data/initialData';

// Clear out any old legacy browser cache fills
try {
  if (typeof window !== 'undefined' && window.localStorage) {
    localStorage.removeItem('biniyam_2d_portfolio_v1');
    localStorage.removeItem('biniyam_graphic_design_portfolio_v2');
  }
} catch (e) {
  // Ignore storage exceptions
}

export function usePortfolioStore() {
  // Always initialize directly from pristine initial data (zero stale cache fills)
  const [data, setData] = useState<PortfolioData>(INITIAL_PORTFOLIO_DATA);
  const isInitialMount = useRef(true);

  // 1. Fetch fresh server-persisted data on load with explicit no-cache
  useEffect(() => {
    fetch('/api/portfolio', {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    })
      .then((res) => {
        if (res.ok) return res.json();
        return null;
      })
      .then((serverData) => {
        if (serverData && serverData.profile) {
          setData((prev) => ({
            ...prev,
            ...serverData,
            profile: { ...prev.profile, ...(serverData.profile || {}) },
            socials: { ...prev.socials, ...(serverData.socials || {}) },
            projects: Array.isArray(serverData.projects) ? serverData.projects : prev.projects,
            pdfDocuments: Array.isArray(serverData.pdfDocuments) ? serverData.pdfDocuments : prev.pdfDocuments,
            adminPassword: serverData.adminPassword || prev.adminPassword
          }));
        }
      })
      .catch((err) => {
        console.warn('Network fetch error, using default portfolio state:', err);
      });
  }, []);

  // 2. Synchronize changes directly to the server (no local cache fills)
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    // Direct push to server
    fetch('/api/portfolio', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      },
      body: JSON.stringify(data)
    }).catch((err) => {
      console.warn('Failed to sync to server:', err);
    });
  }, [data]);

  const updateProfile = (profileUpdate: Partial<Profile>) => {
    setData((prev) => ({
      ...prev,
      profile: { ...prev.profile, ...profileUpdate }
    }));
  };

  const updateSocials = (socialsUpdate: Partial<SocialLinks>) => {
    setData((prev) => ({
      ...prev,
      socials: { ...prev.socials, ...socialsUpdate }
    }));
  };

  const addProject = (project: Omit<DesignProject, 'id'>) => {
    const newProject: DesignProject = {
      ...project,
      id: `proj-${Date.now()}`
    };
    setData((prev) => ({
      ...prev,
      projects: [newProject, ...prev.projects]
    }));
  };

  const updateProject = (project: DesignProject) => {
    setData((prev) => ({
      ...prev,
      projects: prev.projects.map((p) => (p.id === project.id ? project : p))
    }));
  };

  const deleteProject = (id: string) => {
    setData((prev) => ({
      ...prev,
      projects: prev.projects.filter((p) => p.id !== id)
    }));
  };

  const addPdf = (pdf: Omit<PdfDocument, 'id' | 'downloadCount' | 'uploadDate'>) => {
    const newPdf: PdfDocument = {
      ...pdf,
      id: `pdf-${Date.now()}`,
      downloadCount: 0,
      uploadDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    };
    setData((prev) => ({
      ...prev,
      pdfDocuments: [newPdf, ...prev.pdfDocuments]
    }));
  };

  const updatePdf = (pdf: PdfDocument) => {
    setData((prev) => ({
      ...prev,
      pdfDocuments: prev.pdfDocuments.map((doc) => (doc.id === pdf.id ? pdf : doc))
    }));
  };

  const deletePdf = (id: string) => {
    setData((prev) => ({
      ...prev,
      pdfDocuments: prev.pdfDocuments.filter((doc) => doc.id !== id)
    }));
  };

  const incrementPdfDownload = (id: string) => {
    setData((prev) => ({
      ...prev,
      pdfDocuments: prev.pdfDocuments.map((doc) =>
        doc.id === id ? { ...doc, downloadCount: doc.downloadCount + 1 } : doc
      )
    }));
  };

  const updateAdminPassword = (password: string) => {
    setData((prev) => ({
      ...prev,
      adminPassword: password
    }));
  };

  const resetToDefault = () => {
    setData(INITIAL_PORTFOLIO_DATA);
    fetch('/api/portfolio', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      },
      body: JSON.stringify(INITIAL_PORTFOLIO_DATA)
    }).catch(console.error);
  };

  return {
    portfolioData: data,
    updateProfile,
    updateSocials,
    addProject,
    updateProject,
    deleteProject,
    addPdf,
    updatePdf,
    deletePdf,
    incrementPdfDownload,
    updateAdminPassword,
    resetToDefault
  };
}
