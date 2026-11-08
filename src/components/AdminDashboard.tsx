import React, { useState } from 'react';
import {
  X,
  User,
  Image as ImageIcon,
  FileText,
  Share2,
  Lock,
  Plus,
  Trash2,
  Edit2,
  Save,
  Upload,
  CheckCircle2,
  RotateCcw,
  Send,
  Music2,
  AlertTriangle
} from 'lucide-react';
import {
  Language,
  Profile,
  SocialLinks,
  DesignProject,
  PdfDocument,
  DesignCategory
} from '../types/portfolio';
import { TRANSLATIONS } from '../translations';

interface AdminDashboardProps {
  language: Language;
  isOpen: boolean;
  onClose: () => void;
  profile: Profile;
  socials: SocialLinks;
  projects: DesignProject[];
  pdfDocuments: PdfDocument[];
  adminPassword: string;
  onUpdateProfile: (profile: Partial<Profile>) => void;
  onUpdateSocials: (socials: Partial<SocialLinks>) => void;
  onAddProject: (project: Omit<DesignProject, 'id'>) => void;
  onUpdateProject: (project: DesignProject) => void;
  onDeleteProject: (id: string) => void;
  onAddPdf: (pdf: Omit<PdfDocument, 'id' | 'downloadCount' | 'uploadDate'>) => void;
  onUpdatePdf: (pdf: PdfDocument) => void;
  onDeletePdf: (id: string) => void;
  onUpdateAdminPassword: (newPass: string) => void;
  onResetToDefault: () => void;
}

type TabKey = 'profile' | 'projects' | 'pdfs' | 'socials';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  language,
  isOpen,
  onClose,
  profile,
  socials,
  projects,
  pdfDocuments,
  adminPassword,
  onUpdateProfile,
  onUpdateSocials,
  onAddProject,
  onUpdateProject,
  onDeleteProject,
  onAddPdf,
  onUpdatePdf,
  onDeletePdf,
  onUpdateAdminPassword,
  onResetToDefault
}) => {
  const t = TRANSLATIONS[language];
  const [activeTab, setActiveTab] = useState<TabKey>('profile');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Local Form States
  const [profileForm, setProfileForm] = useState<Profile>({ ...profile });
  const [socialsForm, setSocialsForm] = useState<SocialLinks>({ ...socials });
  const [newPassword, setNewPassword] = useState('');

  // Project Modal State (Add / Edit)
  const [editingProject, setEditingProject] = useState<DesignProject | null>(null);
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [projectForm, setProjectForm] = useState<Omit<DesignProject, 'id'>>({
    titleEn: '',
    titleAm: '',
    category: 'posters',
    categoryEn: 'Posters & Print',
    categoryAm: 'ፖስተር እና ህትመት',
    descriptionEn: '',
    descriptionAm: '',
    imageUrl: '',
    tools: ['Adobe Illustrator'],
    year: '2024',
    featured: true,
    clientOrContextEn: '',
    clientOrContextAm: '',
    colorPalette: ['#E11D48', '#0F172A', '#F8FAFC']
  });

  // PDF Modal State (Add / Edit)
  const [editingPdf, setEditingPdf] = useState<PdfDocument | null>(null);
  const [isAddingPdf, setIsAddingPdf] = useState(false);
  const [pdfForm, setPdfForm] = useState<Omit<PdfDocument, 'id' | 'downloadCount' | 'uploadDate'>>({
    titleEn: '',
    titleAm: '',
    descriptionEn: '',
    descriptionAm: '',
    tag: 'Portfolio',
    tagAm: 'ፖርትፎሊዮ',
    fileSize: '2.5 MB',
    fileUrl: '',
    fileName: 'Biniyam_Project.pdf'
  });

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Handlers for Profile
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile(profileForm);
    showToast(t.changesSavedDirectly);
  };

  const handleAvatarFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setProfileForm((prev) => ({ ...prev, avatarUrl: reader.result as string }));
          onUpdateProfile({ avatarUrl: reader.result as string });
          showToast(language === 'am' ? 'የመገለጫ ፎቶው ተቀይሯል!' : 'Profile picture updated live!');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Handlers for Socials
  const handleSaveSocials = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSocials(socialsForm);
    showToast(t.changesSavedDirectly);
  };

  // Handlers for Projects
  const handleSaveProjectForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProject) {
      onUpdateProject({
        ...editingProject,
        ...projectForm
      });
      setEditingProject(null);
    } else {
      onAddProject(projectForm);
      setIsAddingProject(false);
    }
    showToast(t.changesSavedDirectly);
  };

  const handleProjectImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setProjectForm((prev) => ({ ...prev, imageUrl: reader.result as string }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const startEditProject = (proj: DesignProject) => {
    setEditingProject(proj);
    setProjectForm({
      titleEn: proj.titleEn,
      titleAm: proj.titleAm,
      category: proj.category,
      categoryEn: proj.categoryEn,
      categoryAm: proj.categoryAm,
      descriptionEn: proj.descriptionEn,
      descriptionAm: proj.descriptionAm,
      imageUrl: proj.imageUrl,
      tools: proj.tools,
      year: proj.year,
      featured: proj.featured,
      clientOrContextEn: proj.clientOrContextEn,
      clientOrContextAm: proj.clientOrContextAm,
      colorPalette: proj.colorPalette
    });
    setIsAddingProject(false);
  };

  const startNewProject = () => {
    setEditingProject(null);
    setProjectForm({
      titleEn: '',
      titleAm: '',
      category: 'posters',
      categoryEn: 'Posters & Print',
      categoryAm: 'ፖስተር እና ህትመት',
      descriptionEn: '',
      descriptionAm: '',
      imageUrl: '/src/assets/images/design_poster_swiss_1794170346029.jpg',
      tools: ['Adobe Illustrator'],
      year: new Date().getFullYear().toString(),
      featured: true,
      clientOrContextEn: 'Graphic Design Assignment',
      clientOrContextAm: 'የግራፊክ ዲዛይን ፕሮጀክት',
      colorPalette: ['#E11D48', '#0F172A', '#F8FAFC']
    });
    setIsAddingProject(true);
  };

  // Handlers for PDFs
  const handleSavePdfForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPdf) {
      onUpdatePdf({
        ...editingPdf,
        ...pdfForm
      });
      setEditingPdf(null);
    } else {
      onAddPdf(pdfForm);
      setIsAddingPdf(false);
    }
    showToast(t.changesSavedDirectly);
  };

  const handlePdfFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const fileSizeStr = `${(file.size / (1024 * 1024)).toFixed(1)} MB`;
      const fileName = file.name;
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setPdfForm((prev) => ({
            ...prev,
            fileUrl: reader.result as string,
            fileName: fileName,
            fileSize: fileSizeStr,
            titleEn: prev.titleEn || fileName.replace(/\.[^/.]+$/, '').replace(/_/g, ' ')
          }));
          showToast(language === 'am' ? 'የፒዲኤፍ ፋይሉ ተጭኗል!' : 'PDF file uploaded ready to post!');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const startEditPdf = (pdf: PdfDocument) => {
    setEditingPdf(pdf);
    setPdfForm({
      titleEn: pdf.titleEn,
      titleAm: pdf.titleAm,
      descriptionEn: pdf.descriptionEn,
      descriptionAm: pdf.descriptionAm,
      tag: pdf.tag,
      tagAm: pdf.tagAm,
      fileSize: pdf.fileSize,
      fileUrl: pdf.fileUrl,
      fileName: pdf.fileName
    });
    setIsAddingPdf(false);
  };

  const startNewPdf = () => {
    setEditingPdf(null);
    setPdfForm({
      titleEn: '',
      titleAm: '',
      descriptionEn: '',
      descriptionAm: '',
      tag: 'Portfolio Specimen',
      tagAm: 'የስራ ናሙና',
      fileSize: '1.8 MB',
      fileUrl: '',
      fileName: 'Biniyam_Design_Document.pdf'
    });
    setIsAddingPdf(true);
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.trim()) {
      onUpdateAdminPassword(newPassword.trim());
      setNewPassword('');
      showToast(language === 'am' ? 'የአድሚን የይለፍ ቃል ተቀይሯል!' : 'Admin passcode successfully updated!');
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-2 sm:p-4 overflow-y-auto animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-5xl bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 flex flex-col max-h-[92vh] overflow-hidden my-4">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 px-6 py-4 bg-neutral-50 dark:bg-neutral-950/70">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-900 text-white font-bold text-xs dark:bg-white dark:text-neutral-950">
              ADM
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                <span>{t.adminDashboardTitle}</span>
                <span className="rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 text-[10px] font-semibold px-2 py-0.5 border border-emerald-300 dark:border-emerald-800">
                  Live Sync
                </span>
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 hidden sm:block">
                {t.adminDashboardSub}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-700 hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700 transition-colors"
            >
              <X className="h-4 w-4" />
              <span>{t.exitAdmin}</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-neutral-200 dark:border-neutral-800 px-6 gap-2 overflow-x-auto bg-neutral-100/50 dark:bg-neutral-950/30">
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-2 py-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'profile'
                ? 'border-amber-500 text-amber-600 dark:text-amber-400'
                : 'border-transparent text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white'
            }`}
          >
            <User className="h-4 w-4" />
            <span>{t.tabProfile}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('projects')}
            className={`flex items-center gap-2 py-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'projects'
                ? 'border-amber-500 text-amber-600 dark:text-amber-400'
                : 'border-transparent text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white'
            }`}
          >
            <ImageIcon className="h-4 w-4" />
            <span>{t.tabProjects} ({projects.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('pdfs')}
            className={`flex items-center gap-2 py-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'pdfs'
                ? 'border-amber-500 text-amber-600 dark:text-amber-400'
                : 'border-transparent text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white'
            }`}
          >
            <FileText className="h-4 w-4" />
            <span>{t.tabPdfs} ({pdfDocuments.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('socials')}
            className={`flex items-center gap-2 py-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'socials'
                ? 'border-amber-500 text-amber-600 dark:text-amber-400'
                : 'border-transparent text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white'
            }`}
          >
            <Share2 className="h-4 w-4" />
            <span>{t.tabSocials}</span>
          </button>
        </div>

        {/* Tab Content Panes */}
        <div className="flex-1 overflow-y-auto p-6">
          
          {/* TAB 1: Profile & Bio Editor */}
          {activeTab === 'profile' && (
            <form onSubmit={handleSaveProfile} className="space-y-6 max-w-4xl">
              
              {/* Circular Avatar Editor */}
              <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 p-5 bg-neutral-50 dark:bg-neutral-950/40">
                <h3 className="text-sm font-bold text-neutral-900 dark:text-white mb-1">
                  {t.avatarUploadLabel}
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-4">
                  {t.avatarUploadHint}
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-6">
                  {/* Circular Avatar Preview */}
                  <div className="h-24 w-24 rounded-full overflow-hidden border-2 border-amber-500 shadow-md shrink-0 bg-neutral-200">
                    <img
                      src={profileForm.avatarUrl}
                      alt="Avatar Preview"
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="flex-1 w-full space-y-3">
                    <div className="flex items-center gap-3">
                      <label className="cursor-pointer inline-flex items-center gap-2 rounded-lg bg-neutral-900 px-3.5 py-2 text-xs font-semibold text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-100 transition-colors">
                        <Upload className="h-3.5 w-3.5" />
                        <span>{t.uploadImageFile}</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarFileUpload}
                          className="hidden"
                        />
                      </label>
                      <span className="text-xs text-neutral-400">PNG, JPG, WebP</span>
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 block mb-1">
                        {t.orPasteImageUrl}
                      </label>
                      <input
                        type="text"
                        value={profileForm.avatarUrl}
                        onChange={(e) => setProfileForm({ ...profileForm, avatarUrl: e.target.value })}
                        className="w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3 py-1.5 text-xs text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Names & Titles (Bilingual EN & AM) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                    {t.nameEn}
                  </label>
                  <input
                    type="text"
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    className="w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3 py-2 text-xs text-neutral-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                    {t.nameAm}
                  </label>
                  <input
                    type="text"
                    value={profileForm.nameAm}
                    onChange={(e) => setProfileForm({ ...profileForm, nameAm: e.target.value })}
                    className="w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3 py-2 text-xs text-neutral-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                    {t.titleEn}
                  </label>
                  <input
                    type="text"
                    value={profileForm.studentTitleEn}
                    onChange={(e) => setProfileForm({ ...profileForm, studentTitleEn: e.target.value })}
                    className="w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3 py-2 text-xs text-neutral-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                    {t.titleAm}
                  </label>
                  <input
                    type="text"
                    value={profileForm.studentTitleAm}
                    onChange={(e) => setProfileForm({ ...profileForm, studentTitleAm: e.target.value })}
                    className="w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3 py-2 text-xs text-neutral-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Bio (Bilingual) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                    {t.bioLabelEn}
                  </label>
                  <textarea
                    rows={4}
                    value={profileForm.bioEn}
                    onChange={(e) => setProfileForm({ ...profileForm, bioEn: e.target.value })}
                    className="w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 p-2.5 text-xs text-neutral-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                    {t.bioLabelAm}
                  </label>
                  <textarea
                    rows={4}
                    value={profileForm.bioAm}
                    onChange={(e) => setProfileForm({ ...profileForm, bioAm: e.target.value })}
                    className="w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 p-2.5 text-xs text-neutral-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Academic & Location details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                    {t.schoolLabelEn}
                  </label>
                  <input
                    type="text"
                    value={profileForm.schoolEn}
                    onChange={(e) => setProfileForm({ ...profileForm, schoolEn: e.target.value })}
                    className="w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3 py-2 text-xs text-neutral-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                    {t.schoolLabelAm}
                  </label>
                  <input
                    type="text"
                    value={profileForm.schoolAm}
                    onChange={(e) => setProfileForm({ ...profileForm, schoolAm: e.target.value })}
                    className="w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3 py-2 text-xs text-neutral-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                    {t.locationLabelEn}
                  </label>
                  <input
                    type="text"
                    value={profileForm.locationEn}
                    onChange={(e) => setProfileForm({ ...profileForm, locationEn: e.target.value })}
                    className="w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3 py-2 text-xs text-neutral-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                    {t.locationLabelAm}
                  </label>
                  <input
                    type="text"
                    value={profileForm.locationAm}
                    onChange={(e) => setProfileForm({ ...profileForm, locationAm: e.target.value })}
                    className="w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3 py-2 text-xs text-neutral-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                    {t.emailLabel}
                  </label>
                  <input
                    type="email"
                    value={profileForm.email}
                    onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                    className="w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3 py-2 text-xs text-neutral-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                    {t.phoneLabel}
                  </label>
                  <input
                    type="text"
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    className="w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3 py-2 text-xs text-neutral-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 flex justify-end">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-lg bg-neutral-900 px-5 py-2.5 text-xs font-semibold text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-100 shadow-sm"
                >
                  <Save className="h-4 w-4" />
                  <span>{t.saveProfileChanges}</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: Design Projects Manager */}
          {activeTab === 'projects' && (
            <div>
              {/* If Add / Edit modal is active */}
              {isAddingProject || editingProject ? (
                <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 p-6 bg-neutral-50 dark:bg-neutral-950/40">
                  <div className="flex items-center justify-between pb-4 border-b border-neutral-200 dark:border-neutral-800 mb-6">
                    <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                      {editingProject ? t.editProject : t.addNewProject}
                    </h3>
                    <button
                      type="button"
                      onClick={() => {
                        setIsAddingProject(false);
                        setEditingProject(null);
                      }}
                      className="text-xs text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
                    >
                      {t.cancel}
                    </button>
                  </div>

                  <form onSubmit={handleSaveProjectForm} className="space-y-4">
                    {/* Artwork image upload or url */}
                    <div>
                      <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                        {t.projectImage}
                      </label>
                      <div className="flex flex-col sm:flex-row items-center gap-4">
                        <div className="h-24 w-32 rounded-lg overflow-hidden border border-neutral-300 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 shrink-0">
                          {projectForm.imageUrl ? (
                            <img
                              src={projectForm.imageUrl}
                              alt="Preview"
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center text-xs text-neutral-400">
                              No image
                            </div>
                          )}
                        </div>

                        <div className="flex-1 w-full space-y-2">
                          <label className="cursor-pointer inline-flex items-center gap-1.5 rounded-md border border-neutral-300 bg-white dark:border-neutral-700 dark:bg-neutral-800 px-3 py-1.5 text-xs font-medium text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50">
                            <Upload className="h-3.5 w-3.5" />
                            <span>{t.uploadImageFile}</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleProjectImageUpload}
                              className="hidden"
                            />
                          </label>
                          <input
                            type="text"
                            placeholder="Or image URL (e.g. /src/assets/images/...)"
                            value={projectForm.imageUrl}
                            onChange={(e) => setProjectForm({ ...projectForm, imageUrl: e.target.value })}
                            className="w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3 py-1.5 text-xs"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                          {t.projectTitleEn}
                        </label>
                        <input
                          type="text"
                          required
                          value={projectForm.titleEn}
                          onChange={(e) => setProjectForm({ ...projectForm, titleEn: e.target.value })}
                          className="w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3 py-2 text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                          {t.projectTitleAm}
                        </label>
                        <input
                          type="text"
                          value={projectForm.titleAm}
                          onChange={(e) => setProjectForm({ ...projectForm, titleAm: e.target.value })}
                          className="w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3 py-2 text-xs"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                          {t.projectCategory}
                        </label>
                        <select
                          value={projectForm.category}
                          onChange={(e) => {
                            const val = e.target.value as DesignCategory;
                            const map: Record<DesignCategory, { en: string; am: string }> = {
                              posters: { en: 'Posters & Print', am: 'ፖስተር እና ህትመት' },
                              branding: { en: 'Branding & Identity', am: 'ብራንዲንግ እና መለያ' },
                              typography: { en: 'Typography & Culture', am: 'ታይፖግራፊ እና ባህል' },
                              editorial: { en: 'Editorial & Layout', am: 'ኤዲቶሪያል እና አቀማመጥ' },
                              packaging: { en: 'Packaging & Labels', am: 'ማሸጊያ እና ሌብሎች' },
                              vector: { en: 'Vector Art & Motifs', am: 'የቬክተር አርት' }
                            };
                            setProjectForm({
                              ...projectForm,
                              category: val,
                              categoryEn: map[val].en,
                              categoryAm: map[val].am
                            });
                          }}
                          className="w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3 py-2 text-xs"
                        >
                          <option value="posters">Posters & Print</option>
                          <option value="branding">Branding & Identity</option>
                          <option value="typography">Typography & Culture</option>
                          <option value="editorial">Editorial & Layout</option>
                          <option value="packaging">Packaging & Labels</option>
                          <option value="vector">Vector Art</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                          {t.projectYear}
                        </label>
                        <input
                          type="text"
                          value={projectForm.year}
                          onChange={(e) => setProjectForm({ ...projectForm, year: e.target.value })}
                          className="w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3 py-2 text-xs"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                          {t.projectTools}
                        </label>
                        <input
                          type="text"
                          value={projectForm.tools.join(', ')}
                          onChange={(e) =>
                            setProjectForm({
                              ...projectForm,
                              tools: e.target.value.split(',').map((s) => s.trim()).filter(Boolean)
                            })
                          }
                          className="w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3 py-2 text-xs"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                          {t.projectDescEn}
                        </label>
                        <textarea
                          rows={3}
                          value={projectForm.descriptionEn}
                          onChange={(e) => setProjectForm({ ...projectForm, descriptionEn: e.target.value })}
                          className="w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 p-2 text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                          {t.projectDescAm}
                        </label>
                        <textarea
                          rows={3}
                          value={projectForm.descriptionAm}
                          onChange={(e) => setProjectForm({ ...projectForm, descriptionAm: e.target.value })}
                          className="w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 p-2 text-xs"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                        {t.projectPalette}
                      </label>
                      <input
                        type="text"
                        value={projectForm.colorPalette.join(', ')}
                        onChange={(e) =>
                          setProjectForm({
                            ...projectForm,
                            colorPalette: e.target.value.split(',').map((s) => s.trim()).filter(Boolean)
                          })
                        }
                        className="w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3 py-2 text-xs"
                      />
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          setIsAddingProject(false);
                          setEditingProject(null);
                        }}
                        className="rounded-md border border-neutral-300 px-4 py-2 text-xs font-semibold text-neutral-600 dark:border-neutral-700 dark:text-neutral-300"
                      >
                        {t.cancel}
                      </button>
                      <button
                        type="submit"
                        className="rounded-md bg-neutral-900 px-5 py-2 text-xs font-semibold text-white dark:bg-white dark:text-neutral-950"
                      >
                        {t.saveProject}
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                /* Projects List */
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-neutral-500">
                      {projects.length} {language === 'am' ? 'ፕሮጀክቶች ተመዝግበዋል' : 'projects published'}
                    </span>
                    <button
                      type="button"
                      onClick={startNewProject}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-neutral-900 px-3.5 py-2 text-xs font-semibold text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-100 transition-colors shadow-xs"
                    >
                      <Plus className="h-4 w-4" />
                      <span>{t.addNewProject}</span>
                    </button>
                  </div>

                  <div className="divide-y divide-neutral-200 dark:divide-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 overflow-hidden">
                    {projects.map((proj) => (
                      <div
                        key={proj.id}
                        className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-14 w-18 rounded overflow-hidden bg-neutral-200 shrink-0">
                            <img
                              src={proj.imageUrl}
                              alt={proj.titleEn}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div>
                            <span className="text-[10px] font-semibold text-amber-600 uppercase tracking-wide">
                              {proj.categoryEn} · {proj.year}
                            </span>
                            <h4 className="text-sm font-bold text-neutral-900 dark:text-white">
                              {language === 'am' ? proj.titleAm || proj.titleEn : proj.titleEn}
                            </h4>
                            <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-1">
                              {proj.tools.join(', ')}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-center">
                          <button
                            type="button"
                            onClick={() => startEditProject(proj)}
                            className="inline-flex items-center gap-1 rounded border border-neutral-300 dark:border-neutral-700 px-2.5 py-1.5 text-xs text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                            <span>{t.editProject}</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(t.confirmDeleteProject)) {
                                onDeleteProject(proj.id);
                                showToast(language === 'am' ? 'ፕሮጀክቱ ተሰርዟል!' : 'Project deleted!');
                              }
                            }}
                            className="inline-flex items-center gap-1 rounded border border-red-200 dark:border-red-900/60 px-2.5 py-1.5 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            <span>{t.deleteProject}</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: PDF Documents Manager (Post & Tag PDFs) */}
          {activeTab === 'pdfs' && (
            <div>
              {isAddingPdf || editingPdf ? (
                <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 p-6 bg-neutral-50 dark:bg-neutral-950/40">
                  <div className="flex items-center justify-between pb-4 border-b border-neutral-200 dark:border-neutral-800 mb-6">
                    <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                      {editingPdf ? t.editPdf : t.addNewPdf}
                    </h3>
                    <button
                      type="button"
                      onClick={() => {
                        setIsAddingPdf(false);
                        setEditingPdf(null);
                      }}
                      className="text-xs text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
                    >
                      {t.cancel}
                    </button>
                  </div>

                  <form onSubmit={handleSavePdfForm} className="space-y-4">
                    {/* PDF File Upload */}
                    <div className="rounded-lg border border-dashed border-neutral-300 dark:border-neutral-700 p-4 bg-white dark:bg-neutral-900 text-center">
                      <FileText className="mx-auto h-8 w-8 text-amber-500" />
                      <div className="mt-2 text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                        {pdfForm.fileName || 'No file selected'}
                      </div>
                      <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1">
                        {t.pdfUploadNote}
                      </p>
                      <label className="mt-3 cursor-pointer inline-flex items-center gap-2 rounded-md bg-neutral-900 px-3.5 py-2 text-xs font-semibold text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-950">
                        <Upload className="h-3.5 w-3.5" />
                        <span>{t.uploadPdfFile}</span>
                        <input
                          type="file"
                          accept=".pdf,application/pdf"
                          onChange={handlePdfFileUpload}
                          className="hidden"
                        />
                      </label>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                          {t.pdfTitleEn}
                        </label>
                        <input
                          type="text"
                          required
                          value={pdfForm.titleEn}
                          onChange={(e) => setPdfForm({ ...pdfForm, titleEn: e.target.value })}
                          className="w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3 py-2 text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                          {t.pdfTitleAm}
                        </label>
                        <input
                          type="text"
                          value={pdfForm.titleAm}
                          onChange={(e) => setPdfForm({ ...pdfForm, titleAm: e.target.value })}
                          className="w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3 py-2 text-xs"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                          {t.pdfTagEn}
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Brand Manual, Lookbook, CV"
                          value={pdfForm.tag}
                          onChange={(e) => setPdfForm({ ...pdfForm, tag: e.target.value })}
                          className="w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3 py-2 text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                          {t.pdfTagAm}
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. የብራንድ መመሪያ"
                          value={pdfForm.tagAm}
                          onChange={(e) => setPdfForm({ ...pdfForm, tagAm: e.target.value })}
                          className="w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3 py-2 text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                          {t.pdfSize}
                        </label>
                        <input
                          type="text"
                          value={pdfForm.fileSize}
                          onChange={(e) => setPdfForm({ ...pdfForm, fileSize: e.target.value })}
                          className="w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3 py-2 text-xs"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                          {t.pdfDescEn}
                        </label>
                        <textarea
                          rows={3}
                          value={pdfForm.descriptionEn}
                          onChange={(e) => setPdfForm({ ...pdfForm, descriptionEn: e.target.value })}
                          className="w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 p-2 text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                          {t.pdfDescAm}
                        </label>
                        <textarea
                          rows={3}
                          value={pdfForm.descriptionAm}
                          onChange={(e) => setPdfForm({ ...pdfForm, descriptionAm: e.target.value })}
                          className="w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 p-2 text-xs"
                        />
                      </div>
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          setIsAddingPdf(false);
                          setEditingPdf(null);
                        }}
                        className="rounded-md border border-neutral-300 px-4 py-2 text-xs font-semibold text-neutral-600 dark:border-neutral-700 dark:text-neutral-300"
                      >
                        {t.cancel}
                      </button>
                      <button
                        type="submit"
                        className="rounded-md bg-neutral-900 px-5 py-2 text-xs font-semibold text-white dark:bg-white dark:text-neutral-950"
                      >
                        {t.savePdf}
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                /* PDF Documents List */
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-neutral-500">
                      {pdfDocuments.length} {language === 'am' ? 'የፒዲኤፍ ሰነዶች ተለጥፈዋል' : 'PDF documents available for download'}
                    </span>
                    <button
                      type="button"
                      onClick={startNewPdf}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-neutral-900 px-3.5 py-2 text-xs font-semibold text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-100 transition-colors shadow-xs"
                    >
                      <Plus className="h-4 w-4" />
                      <span>{t.addNewPdf}</span>
                    </button>
                  </div>

                  <div className="divide-y divide-neutral-200 dark:divide-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 overflow-hidden">
                    {pdfDocuments.map((doc) => (
                      <div
                        key={doc.id}
                        className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400 flex items-center justify-center shrink-0 font-bold text-xs font-mono">
                            PDF
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-semibold uppercase tracking-wide text-amber-600">
                                {doc.tag}
                              </span>
                              <span className="text-[10px] font-mono text-neutral-400">
                                {doc.fileSize} · {doc.downloadCount} {t.downloads}
                              </span>
                            </div>
                            <h4 className="text-sm font-bold text-neutral-900 dark:text-white">
                              {language === 'am' ? doc.titleAm || doc.titleEn : doc.titleEn}
                            </h4>
                            <p className="text-xs text-neutral-400 font-mono">
                              {doc.fileName}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-center">
                          <button
                            type="button"
                            onClick={() => startEditPdf(doc)}
                            className="inline-flex items-center gap-1 rounded border border-neutral-300 dark:border-neutral-700 px-2.5 py-1.5 text-xs text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                            <span>{t.editPdf}</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(t.confirmDeletePdf)) {
                                onDeletePdf(doc.id);
                                showToast(language === 'am' ? 'ፒዲኤፉ ተሰርዟል!' : 'PDF document deleted!');
                              }
                            }}
                            className="inline-flex items-center gap-1 rounded border border-red-200 dark:border-red-900/60 px-2.5 py-1.5 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            <span>{t.deletePdf}</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: Social Accounts (Telegram & TikTok) & Admin Passcode */}
          {activeTab === 'socials' && (
            <div className="space-y-8 max-w-2xl">
              
              {/* Telegram & TikTok Settings */}
              <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 p-6 bg-white dark:bg-neutral-950/40">
                <h3 className="text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                  <Share2 className="h-4 w-4 text-amber-500" />
                  <span>{t.socialSettingsTitle}</span>
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 mb-6">
                  {t.socialSettingsDesc}
                </p>

                <form onSubmit={handleSaveSocials} className="space-y-5">
                  {/* Telegram */}
                  <div>
                    <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5 mb-1">
                      <Send className="h-3.5 w-3.5 text-sky-500" />
                      <span>{t.telegramUsernameLabel}</span>
                    </label>
                    <div className="flex rounded-md shadow-xs">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-neutral-300 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 text-neutral-500 text-xs font-mono">
                        t.me/
                      </span>
                      <input
                        type="text"
                        value={socialsForm.telegramUsername}
                        onChange={(e) =>
                          setSocialsForm({ ...socialsForm, telegramUsername: e.target.value.replace(/^@/, '') })
                        }
                        placeholder="e.g. binitilahun635"
                        className="flex-1 rounded-r-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3 py-2 text-xs text-neutral-900 dark:text-white"
                      />
                    </div>
                  </div>

                  {/* TikTok */}
                  <div>
                    <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5 mb-1">
                      <Music2 className="h-3.5 w-3.5 text-pink-500" />
                      <span>{t.tiktokUsernameLabel}</span>
                    </label>
                    <div className="flex rounded-md shadow-xs">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-neutral-300 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 text-neutral-500 text-xs font-mono">
                        tiktok.com/@
                      </span>
                      <input
                        type="text"
                        value={socialsForm.tiktokUsername}
                        onChange={(e) =>
                          setSocialsForm({ ...socialsForm, tiktokUsername: e.target.value.replace(/^@/, '') })
                        }
                        placeholder="e.g. biniyam_design"
                        className="flex-1 rounded-r-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3 py-2 text-xs text-neutral-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 rounded-lg bg-neutral-900 px-5 py-2 text-xs font-semibold text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-950"
                    >
                      <Save className="h-3.5 w-3.5" />
                      <span>Save Socials</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Change Admin Password */}
              <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 p-6 bg-white dark:bg-neutral-950/40">
                <h3 className="text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                  <Lock className="h-4 w-4 text-amber-500" />
                  <span>{t.securitySettingsTitle}</span>
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 mb-4">
                  {t.securitySettingsDesc}
                </p>

                <form onSubmit={handleChangePassword} className="flex gap-3">
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new passcode..."
                    className="flex-1 rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3 py-2 text-xs"
                  />
                  <button
                    type="submit"
                    className="rounded-md bg-neutral-900 px-4 py-2 text-xs font-semibold text-white dark:bg-white dark:text-neutral-950"
                  >
                    {t.savePasscode}
                  </button>
                </form>
              </div>

              {/* Reset to Default Data */}
              <div className="rounded-xl border border-amber-200 dark:border-amber-900/60 p-6 bg-amber-50/50 dark:bg-amber-950/20">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-neutral-900 dark:text-white">
                      {t.resetDefaultData}
                    </h4>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
                      {t.resetNotice}
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm('Restore initial portfolio data? Any custom edits will be reset to default.')) {
                          onResetToDefault();
                          setProfileForm(profile);
                          setSocialsForm(socials);
                          showToast('Portfolio reset to default data!');
                        }
                      }}
                      className="mt-3 inline-flex items-center gap-1.5 rounded-md border border-amber-300 dark:border-amber-700 bg-white dark:bg-neutral-900 px-3 py-1.5 text-xs font-semibold text-amber-800 dark:text-amber-300 hover:bg-amber-50"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      <span>{t.resetDefaultData}</span>
                    </button>
                  </div>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Floating Live Sync Toast */}
        {toastMessage && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-full bg-neutral-900 px-4 py-2 text-xs font-semibold text-white shadow-xl dark:bg-white dark:text-neutral-950 border border-neutral-700 animate-in fade-in slide-in-from-bottom-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        )}

      </div>
    </div>
  );
};
