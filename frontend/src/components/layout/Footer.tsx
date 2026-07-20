import React from 'react'

export const Footer: React.FC = () => {
  return (
    <footer className="mt-12 py-6 border-t border-border/80 text-[11px] font-sans text-text/50 flex flex-col sm:flex-row items-center justify-between gap-3">
      <div>
        <span>&copy; {new Date().getFullYear()} StudentHub AI. Built as a Modern Digital Study Library.</span>
      </div>
      <div className="flex gap-4.5 font-medium">
        <a
          href="file:///c:/Users/Zoha/Desktop/StudentHub-AI/README.md"
          className="hover:text-primary transition-colors"
          target="_blank"
          rel="noreferrer"
        >
          Catalog Index
        </a>
        <a
          href="file:///c:/Users/Zoha/Desktop/StudentHub-AI/docs/getting_started.md"
          className="hover:text-primary transition-colors"
          target="_blank"
          rel="noreferrer"
        >
          Reader Guide
        </a>
      </div>
    </footer>
  )
}
