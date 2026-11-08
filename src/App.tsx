/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Language } from './types/portfolio';
import { usePortfolioStore } from './hooks/usePortfolioStore';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ProjectGallery } from './components/ProjectGallery';
import { PdfLibrary } from './components/PdfLibrary';
import { AboutSection } from './components/AboutSection';
import { Footer } from './components/Footer';
import { AdminPasswordModal } from './components/AdminPasswordModal';
import { AdminDashboard } from './components/AdminDashboard';

export default function App() {
  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem('biniyam_lang') as Language) || 'en';
  });

  const [isDark, setIsDark] = useState<boolean>(() => {
    const saved = localStorage.getItem('biniyam_theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [isAdminAuthOpen, setIsAdminAuthOpen] = useState(false);
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState(false);

  // Sync theme to document element
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('biniyam_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('biniyam_theme', 'light');
    }
  }, [isDark]);

  const handleLanguageChange = (newLang: Language) => {
    setLanguage(newLang);
    localStorage.setItem('biniyam_lang', newLang);
  };

  const handleToggleTheme = () => {
    setIsDark((prev) => !prev);
  };

  // Portfolio Store
  const {
    portfolioData,
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
  } = usePortfolioStore();

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 selection:bg-neutral-900 selection:text-white dark:bg-neutral-950 dark:text-neutral-100 font-sans transition-colors">
      
      {/* Navigation Bar with Double-Click Admin Logo */}
      <Navbar
        language={language}
        onLanguageChange={handleLanguageChange}
        isDark={isDark}
        onToggleTheme={handleToggleTheme}
        socials={portfolioData.socials}
        onOpenAdminAuth={() => setIsAdminAuthOpen(true)}
      />

      <main>
        {/* Hero Section with Circular Profile Image Frame & Student Info */}
        <Hero
          language={language}
          profile={portfolioData.profile}
          socials={portfolioData.socials}
          pdfDocuments={portfolioData.pdfDocuments}
          onPdfDownloaded={incrementPdfDownload}
        />

        {/* Design Projects Gallery with Category Filters & Modal */}
        <ProjectGallery
          language={language}
          projects={portfolioData.projects}
        />

        {/* PDF Documents Library with Title Search & Direct Download */}
        <PdfLibrary
          language={language}
          documents={portfolioData.pdfDocuments}
          onPdfDownloaded={incrementPdfDownload}
        />

        {/* About Section with Academic Journey, Tools & Telegram/TikTok Contact */}
        <AboutSection
          language={language}
          profile={portfolioData.profile}
          socials={portfolioData.socials}
        />
      </main>

      {/* Footer */}
      <Footer
        language={language}
        socials={portfolioData.socials}
      />

      {/* Admin Password Gate Modal (Double-click on logo triggers this) */}
      <AdminPasswordModal
        language={language}
        expectedPassword={portfolioData.adminPassword}
        isOpen={isAdminAuthOpen}
        onClose={() => setIsAdminAuthOpen(false)}
        onSuccess={() => {
          setIsAdminAuthOpen(false);
          setIsAdminDashboardOpen(true);
        }}
      />

      {/* Admin Management Dashboard Studio */}
      <AdminDashboard
        language={language}
        isOpen={isAdminDashboardOpen}
        onClose={() => setIsAdminDashboardOpen(false)}
        profile={portfolioData.profile}
        socials={portfolioData.socials}
        projects={portfolioData.projects}
        pdfDocuments={portfolioData.pdfDocuments}
        adminPassword={portfolioData.adminPassword}
        onUpdateProfile={updateProfile}
        onUpdateSocials={updateSocials}
        onAddProject={addProject}
        onUpdateProject={updateProject}
        onDeleteProject={deleteProject}
        onAddPdf={addPdf}
        onUpdatePdf={updatePdf}
        onDeletePdf={deletePdf}
        onUpdateAdminPassword={updateAdminPassword}
        onResetToDefault={resetToDefault}
      />

    </div>
  );
}
