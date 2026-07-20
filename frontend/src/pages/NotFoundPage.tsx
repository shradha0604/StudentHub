import React from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { GraduationCap, ArrowLeft, Search } from 'lucide-react'
import { Button } from '../components/ui/Button'

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate()

  const handleReturn = () => {
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-background flex flex-col justify-between p-6 font-sans text-text">
      
      {/* Header Bar */}
      <header className="max-w-6xl w-full mx-auto flex items-center justify-between py-4">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="h-8 w-8 rounded-[10px] bg-accent text-white flex items-center justify-center shadow-md shadow-accent/15 transition-transform group-hover:scale-105">
            <GraduationCap className="w-4.5 h-4.5" />
          </div>
          <span className="font-serif font-extrabold text-base tracking-tight text-text">
            StudentHub AI
          </span>
        </Link>
        <span className="text-[10px] font-mono text-text/40 uppercase tracking-widest font-bold">
          Catalog Error 404
        </span>
      </header>

      {/* Main Content Area */}
      <main className="my-auto flex flex-col items-center justify-center text-center px-4 max-w-xl mx-auto space-y-8">
        
        {/* Bookshelf illustration with missing book slot */}
        <div className="relative w-full max-w-[280px] h-[160px] bg-card border border-border/80 rounded-[10px] shadow-[0_4px_12px_rgba(139,94,60,0.04)] p-5 flex flex-col justify-between overflow-hidden">
          {/* Light yellow warm glow beam */}
          <div className="absolute inset-0 bg-gradient-to-tr from-amber-100/5 via-transparent to-transparent pointer-events-none" />

          {/* Wooden Shelf line */}
          <div className="flex-grow flex items-end justify-center gap-1.5 pb-1 relative z-10">
            {/* Textbook 1 */}
            <div className="h-24 w-8 bg-[#2F5D50] border border-[#23483E] rounded-t-sm relative flex flex-col justify-center items-center text-white">
              <span className="writing-mode-vertical text-[8px] uppercase tracking-wider select-none font-bold rotate-180">
                DBMS
              </span>
            </div>

            {/* Textbook 2 */}
            <div className="h-20 w-7 bg-[#8B5E3C] border border-[#785133] rounded-t-sm relative flex flex-col justify-center items-center text-white rotate-3">
              <span className="writing-mode-vertical text-[8px] uppercase tracking-wider select-none font-bold rotate-180">
                OS
              </span>
            </div>

            {/* Empty Slot indicating the missing book */}
            <div className="h-24 w-8.5 border border-dashed border-red-300 rounded-t-sm flex items-center justify-center bg-red-50/15 relative">
              <Search className="w-4 h-4 text-red-300 animate-pulse absolute -top-1" />
              <span className="text-red-400 font-serif font-black text-sm select-none">
                ?
              </span>
            </div>

            {/* Textbook 4 */}
            <div className="h-22 w-7.5 bg-[#1E293B] border border-[#0F172A] rounded-t-sm relative flex flex-col justify-center items-center text-white -rotate-2">
              <span className="writing-mode-vertical text-[8px] uppercase tracking-wider select-none font-bold rotate-180">
                NET
              </span>
            </div>

            {/* Textbook 5 */}
            <div className="h-18 w-8 bg-[#C8A97E] border border-[#bfa279] rounded-t-sm relative flex flex-col justify-center items-center text-text font-bold">
              <span className="writing-mode-vertical text-[8px] uppercase tracking-wider select-none rotate-180">
                MATH
              </span>
            </div>
          </div>

          {/* Shelf baseline */}
          <div className="border-t-4 border-[#C8A97E] pt-1.5 flex justify-between text-[8px] font-sans font-bold text-text/35 uppercase tracking-wide">
            <span>Stack Index: Row 4</span>
            <span>Slot Empty</span>
          </div>
        </div>

        {/* Headlines */}
        <div className="space-y-3.5">
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-text tracking-tight">
            This page seems to be missing from the shelf.
          </h1>
          <p className="text-xs md:text-sm text-text/55 font-sans leading-relaxed">
            The catalog ledger doesn't have a record for this volume index. It may have been misplaced or checked out by another reader. Let's redirect you back to the index desk.
          </p>
        </div>

        {/* Recovery Button */}
        <div>
          <Button
            onClick={handleReturn}
            variant="primary"
            className="h-10 px-6 font-bold flex items-center justify-center gap-2 text-xs"
          >
            <ArrowLeft className="w-4 h-4" /> Return to Library
          </Button>
        </div>

      </main>

      {/* Footer credits */}
      <footer className="text-center py-4 text-[10px] font-sans text-text/40">
        &copy; StudentHub AI Library Management. All catalog index codes reserved.
      </footer>

    </div>
  )
}

export default NotFoundPage
