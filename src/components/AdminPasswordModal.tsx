import React, { useState } from 'react';
import { Lock, Eye, EyeOff, ShieldCheck, AlertCircle, X } from 'lucide-react';
import { Language } from '../types/portfolio';
import { TRANSLATIONS } from '../translations';

interface AdminPasswordModalProps {
  language: Language;
  expectedPassword: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminPasswordModal: React.FC<AdminPasswordModalProps> = ({
  language,
  expectedPassword,
  isOpen,
  onClose,
  onSuccess
}) => {
  const t = TRANSLATIONS[language];
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === expectedPassword) {
      setError(false);
      setPassword('');
      onSuccess();
    } else {
      setError(true);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-6 sm:p-8 shadow-2xl dark:border-neutral-800 dark:bg-neutral-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
          aria-label={t.cancel}
        >
          <X className="h-4 w-4" />
        </button>

        {/* Lock Shield Icon */}
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400 mb-4 border border-amber-200 dark:border-amber-800/80">
          <Lock className="h-6 w-6" />
        </div>

        <h3 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white">
          {t.adminAuthTitle}
        </h3>
        <p className="mt-1.5 text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
          {t.adminAuthDesc}
        </p>

        {/* Password Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <div className="mb-1.5">
              <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                {t.adminPasswordLabel}
              </label>
            </div>

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                autoFocus
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError(false);
                }}
                placeholder={t.adminPasswordPlaceholder}
                className={`w-full rounded-lg border py-2.5 pl-3.5 pr-10 text-sm transition-colors focus:outline-none ${
                  error
                    ? 'border-red-500 focus:ring-1 focus:ring-red-500 bg-red-50/20 dark:bg-red-950/20'
                    : 'border-neutral-300 focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:focus:border-white dark:focus:ring-white'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
                aria-label="Toggle password view"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            {error && (
              <div className="mt-2 flex items-center gap-1.5 text-xs text-red-600 dark:text-red-400 animate-in fade-in duration-150">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                <span>{t.invalidPassword}</span>
              </div>
            )}
          </div>

          <div className="mt-6 flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="w-1/2 rounded-lg border border-neutral-300 bg-white py-2.5 text-xs sm:text-sm font-semibold text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700 transition-colors"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              className="w-1/2 rounded-lg bg-neutral-900 py-2.5 text-xs sm:text-sm font-semibold text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-100 shadow-sm transition-colors"
            >
              {t.unlockAdmin}
            </button>
          </div>
        </form>

        <div className="mt-5 border-t border-neutral-100 dark:border-neutral-800/80 pt-4 text-center">
          <p className="text-[11px] text-neutral-400 dark:text-neutral-500">
            {language === 'am'
              ? 'ይህ የአድሚን ክፍል የሚከፈተው በዋናው ሎጎ ላይ ሁለት ጊዜ (double-click) ሲደረግ ብቻ ነው።'
              : 'Admin access is securely gated via double-clicking the main brand logo.'}
          </p>
        </div>
      </div>
    </div>
  );
};
