import React from 'react';
import { Send, Music2, FileDown, ArrowDownRight, Layers, Sparkles, MapPin, GraduationCap } from 'lucide-react';
import { Language, Profile, SocialLinks, PdfDocument } from '../types/portfolio';
import { TRANSLATIONS } from '../translations';
import { triggerPdfDownload } from '../utils/pdfHelper';

interface HeroProps {
  language: Language;
  profile: Profile;
  socials: SocialLinks;
  pdfDocuments: PdfDocument[];
  onPdfDownloaded?: (id: string) => void;
}

export const Hero: React.FC<HeroProps> = ({
  language,
  profile,
  socials,
  pdfDocuments,
  onPdfDownloaded
}) => {
  const t = TRANSLATIONS[language];

  const displayName = language === 'am' ? (profile.nameAm || profile.name) : profile.name;
  const displayTitle = language === 'am' ? (profile.studentTitleAm || profile.studentTitleEn) : profile.studentTitleEn;
  const displayBio = language === 'am' ? (profile.bioAm || profile.bioEn) : profile.bioEn;
  const displaySchool = language === 'am' ? (profile.schoolAm || profile.schoolEn) : profile.schoolEn;
  const displayYear = language === 'am' ? (profile.yearOfStudyAm || profile.yearOfStudyEn) : profile.yearOfStudyEn;
  const displayLocation = language === 'am' ? (profile.locationAm || profile.locationEn) : profile.locationEn;

  const telegramUrl = socials.telegramUsername
    ? `https://t.me/${socials.telegramUsername.replace(/^@/, '')}`
    : '#';
  const tiktokUrl = socials.tiktokUsername
    ? `https://www.tiktok.com/@${socials.tiktokUsername.replace(/^@/, '')}`
    : '#';

  // Find CV or first PDF for direct quick download
  const cvDoc = pdfDocuments.find((p) => p.tag.toLowerCase().includes('curriculum') || p.tag.toLowerCase().includes('cv')) || pdfDocuments[0];

  const handleDownloadCv = () => {
    if (cvDoc) {
      triggerPdfDownload(
        cvDoc.fileUrl,
        cvDoc.fileName,
        cvDoc.titleEn,
        cvDoc.tag,
        cvDoc.descriptionEn
      );
      if (onPdfDownloaded) {
        onPdfDownloaded(cvDoc.id);
      }
    }
  };

  return (
    <section className="relative overflow-hidden border-b border-neutral-200/80 bg-neutral-50/50 py-12 md:py-20 dark:border-neutral-800/80 dark:bg-neutral-900/30">
      {/* Subtle decorative background grid lines */}
      <div 
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_30%,#000_70%,transparent_100%)]"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12">
          
          {/* Circular Frame Profile Image Column */}
          <div className="flex flex-col items-center lg:col-span-4 lg:items-start">
            <div className="relative">
              {/* Artistic Outer Halo Ring */}
              <div 
                className="absolute -inset-2 rounded-full bg-gradient-to-tr from-amber-500/20 via-neutral-200 to-sky-500/20 blur-md dark:from-amber-500/10 dark:via-neutral-700/20 dark:to-sky-500/10"
                aria-hidden="true"
              />

              {/* Circular Frame Container */}
              <div className="relative h-44 w-44 sm:h-52 sm:w-52 lg:h-56 lg:w-56 overflow-hidden rounded-full border-4 border-white bg-neutral-100 shadow-xl ring-1 ring-neutral-200/80 dark:border-neutral-900 dark:bg-neutral-800 dark:ring-neutral-700">
                <img
                  src={profile.avatarUrl}
                  alt={`${profile.name} - Graphic Design Student`}
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover object-top transition-transform duration-500 hover:scale-105"
                  onError={(e) => {
                    // Fallback to stylized SVG placeholder if broken
                    (e.currentTarget as HTMLImageElement).src =
                      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect fill="%23171717" width="200" height="200"/><circle cx="100" cy="85" r="40" fill="%23f59e0b"/><rect x="40" y="145" width="120" height="60" rx="30" fill="%23f59e0b" opacity="0.8"/></svg>';
                  }}
                />
              </div>

              {/* Student Discipline Ribbon / Pill */}
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-neutral-900 px-3.5 py-1 text-[11px] font-semibold text-white shadow-md dark:bg-white dark:text-neutral-950 flex items-center gap-1.5 border border-neutral-800 dark:border-neutral-200">
                <GraduationCap className="h-3 w-3 text-amber-400 dark:text-amber-600" />
                <span>{displayYear}</span>
              </div>
            </div>

            {/* Quick Location & Institution Under Avatar */}
            <div className="mt-6 flex flex-col items-center lg:items-start text-xs text-neutral-500 dark:text-neutral-400 gap-1.5">
              <div className="flex items-center gap-1.5 font-medium">
                <MapPin className="h-3.5 w-3.5 text-neutral-400" />
                <span>{displayLocation}</span>
              </div>
              <div className="text-center lg:text-left text-neutral-400 dark:text-neutral-500 text-[11px]">
                {displaySchool}
              </div>
            </div>
          </div>

          {/* Typography & Student Profile Info Column */}
          <div className="flex flex-col text-center lg:col-span-8 lg:text-left">
            {/* Disciplines Kicker */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-2">
              <span>{t.twoDDesign}</span>
              <span aria-hidden="true">·</span>
              <span>{t.studentBadge}</span>
              <span aria-hidden="true">·</span>
              <span>2024 Portfolio</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-neutral-900 dark:text-white text-balance">
              {displayName}
            </h1>
            
            <p className="mt-1 text-base sm:text-lg font-medium text-neutral-600 dark:text-neutral-300">
              {displayTitle}
            </p>

            {/* Student Bio Prose */}
            <p className="mt-4 max-w-2xl text-sm sm:text-base leading-relaxed text-neutral-600 dark:text-neutral-300">
              {displayBio}
            </p>

            {/* Focus Areas Unboxed Metadata List */}
            <div className="mt-5 flex flex-wrap items-center justify-center lg:justify-start gap-x-3 gap-y-1 text-xs text-neutral-500 dark:text-neutral-400">
              {(language === 'am' ? profile.focusAreasAm : profile.focusAreasEn).map((area, idx, arr) => (
                <React.Fragment key={idx}>
                  <span className="font-medium text-neutral-700 dark:text-neutral-300">{area}</span>
                  {idx < arr.length - 1 && <span aria-hidden="true" className="text-neutral-300 dark:text-neutral-700">/</span>}
                </React.Fragment>
              ))}
            </div>

            {/* Action Buttons & Socials (Telegram & TikTok Only) */}
            <div className="mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-4">
              {/* Explore Works CTA */}
              <a
                href="#projects"
                className="inline-flex items-center gap-2 rounded-lg bg-neutral-900 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-sm hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-100 transition-all hover:translate-y-[-1px] whitespace-nowrap"
              >
                <span>{t.exploreWorks}</span>
                <ArrowDownRight className="h-4 w-4" />
              </a>

              {/* Direct Download Student CV PDF */}
              {cvDoc && (
                <button
                  type="button"
                  onClick={handleDownloadCv}
                  className="inline-flex items-center gap-2 rounded-lg border border-neutral-300 bg-white px-4 py-2.5 text-xs sm:text-sm font-medium text-neutral-800 shadow-xs hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 dark:hover:bg-neutral-700/80 transition-colors whitespace-nowrap"
                >
                  <FileDown className="h-4 w-4 text-amber-500" />
                  <span>{t.downloadResumePdf}</span>
                </button>
              )}

              {/* Socials Group: Telegram and TikTok ONLY */}
              <div className="flex items-center gap-2 pt-2 sm:pt-0">
                {/* Telegram Handle Button */}
                <a
                  href={telegramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-sky-200 bg-sky-50/70 px-3 py-2 text-xs font-semibold text-sky-700 hover:bg-sky-100 dark:border-sky-900/60 dark:bg-sky-950/40 dark:text-sky-300 dark:hover:bg-sky-900/60 transition-colors whitespace-nowrap"
                  title={`Telegram @${socials.telegramUsername}`}
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>Telegram</span>
                  <span className="text-[10px] text-sky-600 dark:text-sky-400 font-mono">
                    @{socials.telegramUsername}
                  </span>
                </a>

                {/* TikTok Handle Button */}
                <a
                  href={tiktokUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-neutral-100/80 px-3 py-2 text-xs font-semibold text-neutral-800 hover:bg-neutral-200 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700 transition-colors whitespace-nowrap"
                  title={`TikTok @${socials.tiktokUsername}`}
                >
                  <Music2 className="h-3.5 w-3.5 text-pink-500" />
                  <span>TikTok</span>
                  <span className="text-[10px] text-neutral-500 dark:text-neutral-400 font-mono">
                    @{socials.tiktokUsername}
                  </span>
                </a>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
