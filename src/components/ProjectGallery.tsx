import React, { useState, useMemo } from 'react';
import { X, ExternalLink, Palette, Layers, Calendar, Maximize2 } from 'lucide-react';
import { Language, DesignProject, DesignCategory } from '../types/portfolio';
import { TRANSLATIONS } from '../translations';

interface ProjectGalleryProps {
  language: Language;
  projects: DesignProject[];
}

export const ProjectGallery: React.FC<ProjectGalleryProps> = ({ language, projects }) => {
  const t = TRANSLATIONS[language];
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedProject, setSelectedProject] = useState<DesignProject | null>(null);

  const categories = useMemo(() => [
    { id: 'all', label: t.filterAll },
    { id: 'posters', label: t.filterPosters },
    { id: 'branding', label: t.filterBranding },
    { id: 'typography', label: t.filterTypography },
    { id: 'editorial', label: t.filterEditorial },
    { id: 'packaging', label: t.filterPackaging },
  ], [t]);

  const filteredProjects = useMemo(() => {
    if (activeCategory === 'all') return projects;
    return projects.filter((p) => p.category === activeCategory);
  }, [projects, activeCategory]);

  return (
    <section id="projects" className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 pb-8 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
            {t.twoDDesign}
          </span>
          <h2 className="mt-1 text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
            {t.projectsHeader}
          </h2>
          <p className="mt-2 text-sm sm:text-base text-neutral-600 dark:text-neutral-400 max-w-2xl">
            {t.projectsSubheader}
          </p>
        </div>

        {/* Category Filter Tabs (Interactive Functional Buttons) */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-neutral-100 rounded-lg dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-800/60">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap ${
                activeCategory === cat.id
                  ? 'bg-white text-neutral-950 shadow-xs dark:bg-neutral-800 dark:text-white'
                  : 'text-neutral-600 hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {filteredProjects.map((project, idx) => {
          const title = language === 'am' ? (project.titleAm || project.titleEn) : project.titleEn;
          const desc = language === 'am' ? (project.descriptionAm || project.descriptionEn) : project.descriptionEn;
          const categoryName = language === 'am' ? (project.categoryAm || project.categoryEn) : project.categoryEn;

          return (
            <article
              key={project.id}
              onClick={() => setSelectedProject(project)}
              className="group cursor-pointer flex flex-col rounded-xl overflow-hidden border border-neutral-200/80 bg-white shadow-xs hover:shadow-md transition-all duration-300 dark:border-neutral-800 dark:bg-neutral-900/60"
            >
              {/* Visual Artwork Container */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-100 dark:bg-neutral-800">
                <img
                  src={project.imageUrl}
                  alt={title}
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src =
                      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect fill="%23262626" width="400" height="300"/><text fill="%23a3a3a3" font-family="sans-serif" font-size="14" x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle">Graphic Design Project</text></svg>';
                  }}
                />

                {/* Subtle Hover Overlay */}
                <div className="absolute inset-0 bg-neutral-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white/95 text-neutral-950 text-xs font-semibold shadow-lg backdrop-blur-xs">
                    <Maximize2 className="h-3.5 w-3.5" />
                    <span>{t.viewProject}</span>
                  </span>
                </div>

                {/* Year Indicator */}
                <div className="absolute top-3 right-3 rounded bg-black/60 backdrop-blur-xs px-2 py-0.5 text-[10px] font-mono text-white">
                  {project.year}
                </div>
              </div>

              {/* Card Meta Content */}
              <div className="p-5 flex flex-col flex-1 justify-between">
                <div>
                  {/* Clean unboxed category & tools metadata */}
                  <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400 mb-2">
                    <span className="font-semibold text-amber-600 dark:text-amber-400">{categoryName}</span>
                    <span aria-hidden="true">·</span>
                    <span>{project.tools[0] || 'Graphic Design'}</span>
                  </div>

                  <h3 className="text-lg font-bold text-neutral-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors line-clamp-1">
                    {title}
                  </h3>

                  <p className="mt-1.5 text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 line-clamp-2 leading-relaxed">
                    {desc}
                  </p>
                </div>

                {/* Color Palette Dots & Quick Tool preview */}
                <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    {project.colorPalette?.slice(0, 4).map((hex, i) => (
                      <span
                        key={i}
                        className="h-3 w-3 rounded-full border border-black/10 dark:border-white/10"
                        style={{ backgroundColor: hex }}
                        title={hex}
                      />
                    ))}
                  </div>
                  <span className="text-[11px] font-mono text-neutral-400 dark:text-neutral-500">
                    {project.tools.slice(0, 2).join(' / ')}
                  </span>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Project Detail Lightbox Modal */}
      {selectedProject && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in duration-200"
          onClick={() => setSelectedProject(null)}
        >
          <div
            className="relative w-full max-w-4xl bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl overflow-hidden border border-neutral-200 dark:border-neutral-800 my-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Close Button */}
            <button
              type="button"
              onClick={() => setSelectedProject(null)}
              className="absolute top-4 right-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/90 transition-colors"
              aria-label={t.closeModal}
            >
              <X className="h-5 w-5" />
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-12 max-h-[85vh] overflow-y-auto">
              {/* Artwork Media Frame */}
              <div className="lg:col-span-7 bg-neutral-950 flex items-center justify-center p-4 sm:p-6">
                <img
                  src={selectedProject.imageUrl}
                  alt={language === 'am' ? selectedProject.titleAm : selectedProject.titleEn}
                  referrerPolicy="no-referrer"
                  className="max-h-[60vh] w-auto max-w-full rounded-lg object-contain shadow-md"
                />
              </div>

              {/* Artwork Meta Details */}
              <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400 mb-2">
                    <span className="font-semibold text-amber-600 dark:text-amber-400">
                      {language === 'am' ? selectedProject.categoryAm : selectedProject.categoryEn}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono">{selectedProject.year}</span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white">
                    {language === 'am' ? selectedProject.titleAm : selectedProject.titleEn}
                  </h3>

                  <div className="mt-2 text-xs font-medium text-neutral-500 dark:text-neutral-400">
                    <span className="font-semibold text-neutral-700 dark:text-neutral-300">{t.clientContext}: </span>
                    {language === 'am' ? selectedProject.clientOrContextAm : selectedProject.clientOrContextEn}
                  </div>

                  <p className="mt-4 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
                    {language === 'am' ? selectedProject.descriptionAm : selectedProject.descriptionEn}
                  </p>

                  {/* Tools Used */}
                  <div className="mt-6">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-2">
                      {t.toolsUsed}
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedProject.tools.map((tool, idx) => (
                        <span
                          key={idx}
                          className="rounded bg-neutral-100 dark:bg-neutral-800 px-2 py-1 text-xs font-medium text-neutral-700 dark:text-neutral-300 font-mono"
                        >
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Color Palette Swatches */}
                  {selectedProject.colorPalette && selectedProject.colorPalette.length > 0 && (
                    <div className="mt-6">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-2">
                        {t.colorPalette}
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedProject.colorPalette.map((hex, idx) => (
                          <div key={idx} className="flex items-center gap-1.5 rounded-md bg-neutral-50 dark:bg-neutral-800/80 p-1 pr-2 border border-neutral-200 dark:border-neutral-700">
                            <span
                              className="h-4 w-4 rounded-full border border-black/10"
                              style={{ backgroundColor: hex }}
                            />
                            <span className="text-[11px] font-mono text-neutral-700 dark:text-neutral-300 uppercase">
                              {hex}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-8 pt-4 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between text-xs text-neutral-500">
                  <span>Biniyam Graphic Design Portfolio</span>
                  <button
                    type="button"
                    onClick={() => setSelectedProject(null)}
                    className="font-medium text-amber-600 hover:text-amber-700 dark:text-amber-400"
                  >
                    {t.closeModal}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
