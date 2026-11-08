import { useState, useEffect, useRef } from 'react';
import { PortfolioData, Profile, SocialLinks, DesignProject, PdfDocument } from '../types/portfolio';
import { INITIAL_PORTFOLIO_DATA } from '../data/initialData';

const STORAGE_KEY = 'biniyam_graphic_design_portfolio_v2';

export function usePortfolioStore() {
  const [data, setData] = useState<PortfolioData>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          ...INITIAL_PORTFOLIO_DATA,
          ...parsed,
          profile: { ...INITIAL_PORTFOLIO_DATA.profile, ...(parsed.profile || {}) },
          socials: { ...INITIAL_PORTFOLIO_DATA.socials, ...(parsed.socials || {}) },
          projects: Array.isArray(parsed.projects) ? parsed.projects : INITIAL_PORTFOLIO_DATA.projects,
          pdfDocuments: Array.isArray(parsed.pdfDocuments) ? parsed.pdfDocuments : INITIAL_PORTFOLIO_DATA.pdfDocuments,
          adminPassword: parsed.adminPassword || '1234'
        };
      }
    } catch (e) {
      console.warn('Failed to parse portfolio data from storage, using initial data:', e);
    }
    return INITIAL_PORTFOLIO_DATA;
  });

  const isInitialMount = useRef(true);

  // 1. Fetch server-persisted data on load so all visitors see the latest admin changes
  useEffect(() => {
    fetch('/api/portfolio')
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
        // Fallback to local storage gracefully if server not reachable
        console.info('Client-side cache active:', err);
      });
  }, []);

  // 2. Keep localStorage and Server updated whenever data changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('Failed to save portfolio data to local storage:', e);
    }

    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    // Push changes directly to the server so every device sees the updates
    fetch('/api/portfolio', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
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
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_PORTFOLIO_DATA));
      fetch('/api/portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(INITIAL_PORTFOLIO_DATA)
      }).catch(console.error);
    } catch (e) {
      console.error(e);
    }
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
