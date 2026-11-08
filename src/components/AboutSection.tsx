import React from 'react';
import { Mail, Phone, MapPin, Send, Music2, GraduationCap, Compass, Palette } from 'lucide-react';
import { Language, Profile, SocialLinks } from '../types/portfolio';
import { TRANSLATIONS } from '../translations';

interface AboutSectionProps {
  language: Language;
  profile: Profile;
  socials: SocialLinks;
}

export const AboutSection: React.FC<AboutSectionProps> = ({
  language,
  profile,
  socials
}) => {
  const t = TRANSLATIONS[language];

  const displayName = language === 'am' ? (profile.nameAm || profile.name) : profile.name;
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

  return (
    <section id="about" className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Top Section Title */}
      <div className="pb-8 border-b border-neutral-200 dark:border-neutral-800">
        <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
          {language === 'am' ? 'የተማሪው መረጃ' : 'Student Biography & Craft'}
        </span>
        <h2 className="mt-1 text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
          {t.aboutHeader}
        </h2>
        <p className="mt-2 text-sm sm:text-base text-neutral-600 dark:text-neutral-400">
          {t.aboutSubheader}
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Column: Academic Journey & Philosophy */}
        <div className="lg:col-span-7 space-y-8">
          <div>
            <div className="flex items-center gap-2 text-sm font-bold text-neutral-900 dark:text-white mb-3">
              <GraduationCap className="h-4 w-4 text-amber-500" />
              <span>{t.educationTitle}</span>
            </div>
            <div className="rounded-xl border border-neutral-200/80 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900/50 shadow-xs">
              <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                {displaySchool}
              </h3>
              <p className="mt-1 text-xs sm:text-sm font-medium text-amber-600 dark:text-amber-400">
                {displayYear}
              </p>
              <p className="mt-3 text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
                {displayBio}
              </p>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 text-sm font-bold text-neutral-900 dark:text-white mb-3">
              <Compass className="h-4 w-4 text-amber-500" />
              <span>{t.designPhilosophy}</span>
            </div>
            <div className="rounded-xl border border-neutral-200/80 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900/50 shadow-xs">
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
                {t.designPhilosophyText}
              </p>
            </div>
          </div>

          {/* Core Tools */}
          <div>
            <div className="flex items-center gap-2 text-sm font-bold text-neutral-900 dark:text-white mb-3">
              <Palette className="h-4 w-4 text-amber-500" />
              <span>{t.softwareTitle}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {profile.tools.map((tool, idx) => (
                <div
                  key={idx}
                  className="rounded-lg border border-neutral-200 bg-white px-3 py-2 text-xs font-semibold text-neutral-800 shadow-xs dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-200"
                >
                  {tool}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Contact & Direct Social Profiles (Telegram & TikTok) */}
        <div id="contact" className="lg:col-span-5">
          <div className="rounded-2xl border border-neutral-200/90 bg-neutral-900 p-6 sm:p-8 text-white shadow-xl dark:border-neutral-800 dark:bg-neutral-900/90">
            <h3 className="text-xl font-bold tracking-tight text-white">
              {t.contactTitle}
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-neutral-300 leading-relaxed">
              {t.contactSub}
            </p>

            <div className="mt-6 space-y-4 border-t border-neutral-800 pt-6">
              {/* Email */}
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-neutral-800 text-neutral-300">
                  <Mail className="h-4 w-4" />
                </div>
                <div>
                  <span className="text-[11px] font-medium text-neutral-400 block">{t.email}</span>
                  <a
                    href={`mailto:${profile.email}`}
                    className="text-xs sm:text-sm font-semibold text-white hover:text-amber-400 transition-colors"
                  >
                    {profile.email}
                  </a>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-neutral-800 text-neutral-300">
                  <Phone className="h-4 w-4" />
                </div>
                <div>
                  <span className="text-[11px] font-medium text-neutral-400 block">{t.phone}</span>
                  <a
                    href={`tel:${profile.phone}`}
                    className="text-xs sm:text-sm font-semibold text-white hover:text-amber-400 transition-colors"
                  >
                    {profile.phone}
                  </a>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-neutral-800 text-neutral-300">
                  <MapPin className="h-4 w-4" />
                </div>
                <div>
                  <span className="text-[11px] font-medium text-neutral-400 block">{t.location}</span>
                  <span className="text-xs sm:text-sm font-semibold text-white">
                    {displayLocation}
                  </span>
                </div>
              </div>
            </div>

            {/* Direct Social Media Links: Telegram & TikTok ONLY */}
            <div className="mt-8 pt-6 border-t border-neutral-800 space-y-3">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 block">
                {language === 'am' ? 'ማህበራዊ ገጾቼ (ቴሌግራም እና ቲክቶክ)' : 'Direct Social Links'}
              </span>

              {/* Telegram Action Button */}
              <a
                href={telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between w-full rounded-xl bg-sky-500/15 hover:bg-sky-500/25 border border-sky-500/30 px-4 py-3 text-xs sm:text-sm font-semibold text-sky-300 transition-all group"
              >
                <div className="flex items-center gap-2.5">
                  <Send className="h-4 w-4 text-sky-400 group-hover:scale-110 transition-transform" />
                  <span>Telegram</span>
                </div>
                <span className="text-xs font-mono text-sky-400">@{socials.telegramUsername}</span>
              </a>

              {/* TikTok Action Button */}
              <a
                href={tiktokUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between w-full rounded-xl bg-neutral-800/80 hover:bg-neutral-800 border border-neutral-700/80 px-4 py-3 text-xs sm:text-sm font-semibold text-neutral-200 transition-all group"
              >
                <div className="flex items-center gap-2.5">
                  <Music2 className="h-4 w-4 text-pink-500 group-hover:scale-110 transition-transform" />
                  <span>TikTok</span>
                </div>
                <span className="text-xs font-mono text-neutral-400">@{socials.tiktokUsername}</span>
              </a>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
