import React from 'react';
import { Send, Music2 } from 'lucide-react';
import { Language, SocialLinks } from '../types/portfolio';
import { TRANSLATIONS } from '../translations';

interface FooterProps {
  language: Language;
  socials: SocialLinks;
}

export const Footer: React.FC<FooterProps> = ({
  language,
  socials
}) => {
  const t = TRANSLATIONS[language];

  const telegramUrl = socials.telegramUsername
    ? `https://t.me/${socials.telegramUsername.replace(/^@/, '')}`
    : '#';
  const tiktokUrl = socials.tiktokUsername
    ? `https://www.tiktok.com/@${socials.tiktokUsername.replace(/^@/, '')}`
    : '#';

  return (
    <footer className="border-t border-neutral-200/80 bg-white py-10 dark:border-neutral-800/80 dark:bg-neutral-950 transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          
          {/* Logo & Student Identity */}
          <div className="flex items-center gap-3">
            <div
              className="flex h-7 w-7 select-none items-center justify-center rounded bg-neutral-900 text-white font-black text-xs dark:bg-white dark:text-neutral-950"
            >
              B
            </div>
            <div className="text-xs text-neutral-500 dark:text-neutral-400">
              <span className="font-bold text-neutral-900 dark:text-white">
                {language === 'am' ? 'ቢንያም' : 'Biniyam'}
              </span>
              <span className="mx-1.5">·</span>
              <span>{language === 'am' ? 'የግራፊክስ ዲዛይን ፖርትፎሊዮ' : 'Graphic Design Portfolio'}</span>
            </div>
          </div>

          {/* Socials: Telegram & TikTok ONLY */}
          <div className="flex items-center gap-4 text-xs font-medium text-neutral-600 dark:text-neutral-400">
            <a
              href={telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
            >
              <Send className="h-3.5 w-3.5" />
              <span>Telegram (@{socials.telegramUsername})</span>
            </a>
            <span aria-hidden="true" className="text-neutral-300 dark:text-neutral-700">·</span>
            <a
              href={tiktokUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-pink-600 dark:hover:text-pink-400 transition-colors"
            >
              <Music2 className="h-3.5 w-3.5" />
              <span>TikTok (@{socials.tiktokUsername})</span>
            </a>
          </div>

        </div>

        <div className="mt-8 border-t border-neutral-100 dark:border-neutral-900 pt-6 text-center text-xs text-neutral-400 dark:text-neutral-500">
          © {new Date().getFullYear()} Biniyam. {language === 'am' ? 'መብቱ በህግ የተጠበቀ ነው።' : 'All rights reserved.'} Graphic Design Portfolio.
        </div>
      </div>
    </footer>
  );
};
