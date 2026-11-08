import React, { useState, useMemo } from 'react';
import { Search, FileDown, FileText, CheckCircle2, X, Download, Tag } from 'lucide-react';
import { Language, PdfDocument } from '../types/portfolio';
import { TRANSLATIONS } from '../translations';
import { triggerPdfDownload } from '../utils/pdfHelper';

interface PdfLibraryProps {
  language: Language;
  documents: PdfDocument[];
  onPdfDownloaded: (id: string) => void;
}

export const PdfLibrary: React.FC<PdfLibraryProps> = ({
  language,
  documents,
  onPdfDownloaded
}) => {
  const t = TRANSLATIONS[language];
  const [searchQuery, setSearchQuery] = useState('');
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  // Filter documents by title (EN and AM) and tag
  const filteredDocs = useMemo(() => {
    if (!searchQuery.trim()) return documents;
    const q = searchQuery.toLowerCase().trim();
    return documents.filter((doc) => {
      const matchTitleEn = doc.titleEn?.toLowerCase().includes(q);
      const matchTitleAm = doc.titleAm?.toLowerCase().includes(q);
      const matchTag = doc.tag?.toLowerCase().includes(q) || doc.tagAm?.toLowerCase().includes(q);
      const matchDesc = doc.descriptionEn?.toLowerCase().includes(q) || doc.descriptionAm?.toLowerCase().includes(q);
      return matchTitleEn || matchTitleAm || matchTag || matchDesc;
    });
  }, [documents, searchQuery]);

  const handleDownload = (doc: PdfDocument) => {
    setDownloadingId(doc.id);
    triggerPdfDownload(
      doc.fileUrl,
      doc.fileName,
      doc.titleEn,
      doc.tag,
      doc.descriptionEn
    );
    onPdfDownloaded(doc.id);

    setTimeout(() => {
      setDownloadingId(null);
    }, 1200);
  };

  return (
    <section id="pdfs" className="border-t border-neutral-200/80 bg-neutral-100/40 py-16 md:py-24 dark:border-neutral-800/80 dark:bg-neutral-900/20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
            <FileText className="h-4 w-4" />
            <span>{language === 'am' ? 'የፒዲኤፍ ሰነዶች ቤተ-መጽሐፍት' : 'Graphic Design PDF Library'}</span>
          </div>
          <h2 className="mt-2 text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
            {t.pdfSectionTitle}
          </h2>
          <p className="mt-2 text-sm sm:text-base text-neutral-600 dark:text-neutral-400">
            {t.pdfSectionDesc}
          </p>
        </div>

        {/* Live Search Bar for PDF Documents by Title and Tag */}
        <div className="mt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative w-full max-w-md">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-neutral-400 dark:text-neutral-500">
              <Search className="h-4 w-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.pdfSearchPlaceholder}
              className="w-full rounded-lg border border-neutral-300 bg-white py-2.5 pl-10 pr-9 text-xs sm:text-sm text-neutral-900 placeholder-neutral-400 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:placeholder-neutral-500 shadow-xs transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
                aria-label={t.clearSearch}
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Result Count / Status */}
          <div className="text-xs text-neutral-500 dark:text-neutral-400 flex items-center gap-2">
            <span>
              {language === 'am'
                ? `${filteredDocs.length} ከ ${documents.length} ሰነዶች ተገኝተዋል`
                : `Showing ${filteredDocs.length} of ${documents.length} PDF documents`}
            </span>
          </div>
        </div>

        {/* PDF Documents Grid */}
        {filteredDocs.length > 0 ? (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {filteredDocs.map((doc) => {
              const title = language === 'am' ? (doc.titleAm || doc.titleEn) : doc.titleEn;
              const tag = language === 'am' ? (doc.tagAm || doc.tag) : doc.tag;
              const desc = language === 'am' ? (doc.descriptionAm || doc.descriptionEn) : doc.descriptionEn;
              const isDownloading = downloadingId === doc.id;

              return (
                <div
                  key={doc.id}
                  className="flex flex-col justify-between rounded-xl border border-neutral-200/90 bg-white p-6 shadow-xs hover:border-neutral-300 hover:shadow-md transition-all dark:border-neutral-800 dark:bg-neutral-900/80 dark:hover:border-neutral-700"
                >
                  <div>
                    {/* Top Tag & Metadata */}
                    <div className="flex items-center justify-between gap-4 mb-3">
                      <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
                        <Tag className="h-3 w-3 text-amber-500" />
                        <span className="font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wide text-[11px]">
                          {tag}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono text-neutral-400">{doc.fileSize}</span>
                      </div>
                      
                      <span className="text-[11px] font-mono text-neutral-400 dark:text-neutral-500">
                        {doc.downloadCount} {t.downloads}
                      </span>
                    </div>

                    {/* Document Title */}
                    <h3 className="text-lg font-bold text-neutral-900 dark:text-white line-clamp-1">
                      {title}
                    </h3>

                    {/* Description */}
                    <p className="mt-2 text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed line-clamp-2">
                      {desc}
                    </p>
                  </div>

                  {/* Bottom Action Strip: Direct Download */}
                  <div className="mt-6 pt-4 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-1.5 text-[11px] text-neutral-400 dark:text-neutral-500 font-mono truncate">
                      <FileText className="h-3.5 w-3.5 shrink-0 text-red-500" />
                      <span className="truncate">{doc.fileName}</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDownload(doc)}
                      disabled={isDownloading}
                      className="inline-flex items-center gap-2 rounded-lg bg-neutral-900 px-4 py-2 text-xs font-semibold text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-100 shadow-xs transition-all active:scale-95 whitespace-nowrap shrink-0"
                    >
                      {isDownloading ? (
                        <>
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 dark:text-emerald-600" />
                          <span>{language === 'am' ? 'በመውረድ ላይ...' : 'Downloaded!'}</span>
                        </>
                      ) : (
                        <>
                          <Download className="h-3.5 w-3.5 text-amber-400 dark:text-amber-600" />
                          <span>{t.downloadPdf}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty Search State */
          <div className="mt-10 rounded-xl border border-dashed border-neutral-300 bg-white p-12 text-center dark:border-neutral-700 dark:bg-neutral-900/40">
            <Search className="mx-auto h-8 w-8 text-neutral-400" />
            <h4 className="mt-3 text-base font-semibold text-neutral-900 dark:text-white">
              {t.noPdfsFound}
            </h4>
            <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
              {language === 'am'
                ? 'እባክዎ የተለየ ቃል ወይም ርዕስ ፈልገው እንደገና ይሞክሩ።'
                : 'Try adjusting your search terms or view all documents.'}
            </p>
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="mt-4 inline-flex items-center gap-1.5 rounded-md bg-neutral-100 px-3 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
            >
              {t.clearSearch}
            </button>
          </div>
        )}

      </div>
    </section>
  );
};
