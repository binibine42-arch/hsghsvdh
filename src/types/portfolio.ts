export type Language = 'en' | 'am';

export interface SocialLinks {
  telegramUsername: string; // e.g. "biniyam_gd" or "binitilahun635"
  tiktokUsername: string;   // e.g. "biniyam_design"
}

export interface Profile {
  name: string;
  nameAm: string;
  studentTitleEn: string;
  studentTitleAm: string;
  avatarUrl: string;
  bioEn: string;
  bioAm: string;
  schoolEn: string;
  schoolAm: string;
  yearOfStudyEn: string;
  yearOfStudyAm: string;
  locationEn: string;
  locationAm: string;
  email: string;
  phone: string;
  focusAreasEn: string[];
  focusAreasAm: string[];
  tools: string[];
}

export type DesignCategory = 'posters' | 'branding' | 'typography' | 'packaging' | 'editorial' | 'vector';

export interface DesignProject {
  id: string;
  titleEn: string;
  titleAm: string;
  category: DesignCategory;
  categoryEn: string;
  categoryAm: string;
  descriptionEn: string;
  descriptionAm: string;
  imageUrl: string;
  tools: string[];
  year: string;
  featured: boolean;
  clientOrContextEn: string;
  clientOrContextAm: string;
  colorPalette: string[]; // hex codes e.g. ["#E11D48", "#1E293B", "#F8FAFC"]
}

export interface PdfDocument {
  id: string;
  titleEn: string;
  titleAm: string;
  descriptionEn: string;
  descriptionAm: string;
  tag: string;
  tagAm: string;
  fileSize: string;
  fileUrl: string;      // Base64 Data URL, Blob URL, or external link
  fileName: string;
  uploadDate: string;
  downloadCount: number;
}

export interface PortfolioData {
  adminPassword: string;
  profile: Profile;
  socials: SocialLinks;
  projects: DesignProject[];
  pdfDocuments: PdfDocument[];
}
