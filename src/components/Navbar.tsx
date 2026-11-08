import React, { useState } from 'react';
import { Send, Music2, Sun, Moon, Sparkles, FileDown, Lock } from 'lucide-react';
import { Language, SocialLinks } from '../types/portfolio';
import { TRANSLATIONS } from '../translations';

interface NavbarProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  isDark: boolean;
  onToggleTheme: () => void;
  socials: SocialLinks;
  onOpenAdminAuth: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  language,
  onLanguageChange,
  isDark,
  onToggleTheme,
  socials,
  onOpenAdminAuth
}) => {
  const t = TRANSLATIONS[language];
  const [clickCount, setClickCount] = useState(0);
  const [showHint, setShowHint] = useState(false);

  // Friendly click handler that detects double click or guides user
  const handleLogoClick = () => {
    setClickCount((prev) => {
      const next = prev + 1;
      if (next === 1) {
        setShowHint(true);
        setTimeout(() => setShowHint(false), 2500);
        setTimeout(() => setClickCount(0), 400);
      }
      return next;
    });
  };

  const handleLogoDoubleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onOpenAdminAuth();
  };

  const telegramUrl = socials.telegramUsername
    ? `https://t.me/${socials.telegramUsername.replace(/^@/, '')}`
    : '#';
  const tiktokUrl = socials.tiktokUsername
    ? `https://www.tiktok.com/@${socials.tiktokUsername.replace(/^@/, '')}`
    : '#';

  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-200/80 bg-white/90 backdrop-blur-md dark:border-neutral-800/80 dark:bg-neutral-950/90 transition-colors">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Brand / Logo with Double-Click Admin trigger */}
        <div className="relative flex items-center gap-3 shrink-0">
          <div
            onDoubleClick={handleLogoDoubleClick}
            onClick={handleLogoClick}
            title={t.doubleClickHint}
            className="group flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 transition-all select-none hover:bg-neutral-100 dark:hover:bg-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.altKey) onOpenAdminAuth();
            }}
          >
            {/* Geometric Bauhaus Logo Icon */}
            <div className="relative flex h-8 w-8 items-center justify-center rounded-md bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 font-black text-sm tracking-tighter shadow-sm transition-transform group-hover:scale-105">
              <span>BD</span>
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5 items-center justify-center">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500 opacity-90 group-hover:bg-emerald-500 transition-colors" />
              </span>
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-base font-bold tracking-tight text-neutral-900 dark:text-white whitespace-nowrap">
                  {language === 'am' ? 'ቢንያም' : 'BINIYAM'}
                </span>
              </div>
              <span className="text-[10px] text-neutral-500 dark:text-neutral-400 hidden sm:inline whitespace-nowrap">
                {language === 'am' ? 'የግራፊክስ ዲዛይን ፖርትፎሊዮ' : 'Graphic Design Portfolio'}
              </span>
            </div>
          </div>

          {/* Double Click Hint Toast / Badge */}
          {showHint && (
            <div className="absolute top-12 left-0 z-50 flex items-center gap-1.5 rounded-md border border-neutral-200 bg-white px-2.5 py-1 text-xs text-neutral-700 shadow-lg animate-in fade-in slide-in-from-top-1 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 whitespace-nowrap">
              <Lock className="h-3 w-3 text-amber-500" />
              <span>{t.doubleClickHint}</span>
            </div>
          )}
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-neutral-600 dark:text-neutral-300">
          <a
            href="#projects"
            className="hover:text-neutral-950 dark:hover:text-white transition-colors whitespace-nowrap"
          >
            {t.navWorks}
          </a>
          <a
            href="#pdfs"
            className="hover:text-neutral-950 dark:hover:text-white transition-colors whitespace-nowrap flex items-center gap-1.5"
          >
            <span>{t.navPdfs}</span>
            <span className="text-[10px] rounded bg-neutral-100 dark:bg-neutral-800 px-1.5 py-0.2 text-neutral-600 dark:text-neutral-400 font-mono">
              PDF
            </span>
          </a>
          <a
            href="#about"
            className="hover:text-neutral-950 dark:hover:text-white transition-colors whitespace-nowrap"
          >
            {t.navAbout}
          </a>
          <a
            href="#contact"
            className="hover:text-neutral-950 dark:hover:text-white transition-colors whitespace-nowrap"
          >
            {t.navContact}
          </a>
        </nav>

        {/* Zone 3: Socials (Telegram & TikTok only), Lang switcher, Dark mode, PDF Action */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Socials: Telegram & TikTok ONLY */}
          <div className="flex items-center gap-1 border-r border-neutral-200 dark:border-neutral-800 pr-2 sm:pr-3">
            <a
              href={telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              title={`Telegram: @${socials.telegramUsername}`}
              className="flex h-8 w-8 items-center justify-center rounded-md text-neutral-600 hover:text-sky-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:text-sky-400 dark:hover:bg-neutral-900 transition-colors"
              aria-label="Telegram"
            >
              <Send className="h-4 w-4" />
            </a>
            <a
              href={tiktokUrl}
              target="_blank"
              rel="noopener noreferrer"
              title={`TikTok: @${socials.tiktokUsername}`}
              className="flex h-8 w-8 items-center justify-center rounded-md text-neutral-600 hover:text-pink-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:text-pink-400 dark:hover:bg-neutral-900 transition-colors"
              aria-label="TikTok"
            >
              {/* TikTok Music Icon */}
              <Music2 className="h-4 w-4" />
            </a>
          </div>

          {/* Bilingual Language Switcher */}
          <div className="flex items-center rounded-md bg-neutral-100 p-0.5 dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-800/60">
            <button
              type="button"
              onClick={() => onLanguageChange('en')}
              className={`px-2 py-1 text-xs font-semibold rounded transition-colors ${
                language === 'en'
                  ? 'bg-white text-neutral-950 shadow-xs dark:bg-neutral-800 dark:text-white'
                  : 'text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white'
              }`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => onLanguageChange('am')}
              className={`px-2 py-1 text-xs font-semibold rounded transition-colors ${
                language === 'am'
                  ? 'bg-white text-neutral-950 shadow-xs dark:bg-neutral-800 dark:text-white'
                  : 'text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white'
              }`}
            >
              አማርኛ
            </button>
          </div>

          {/* Light / Dark Mode Toggle */}
          <button
            type="button"
            onClick={onToggleTheme}
            className="flex h-8 w-8 items-center justify-center rounded-md text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:text-white dark:hover:bg-neutral-900 transition-colors"
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          {/* Direct PDF Jump Action */}
          <a
            href="#pdfs"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-100 rounded-md transition-colors shadow-xs whitespace-nowrap"
          >
            <FileDown className="h-3.5 w-3.5" />
            <span>{t.navPdfs}</span>
          </a>
        </div>
      </div>
    </header>
  );
};
