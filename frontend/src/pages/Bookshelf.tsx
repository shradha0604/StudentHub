import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Plus, X, ChevronRight } from 'lucide-react'
import { useToast } from '../components/ui/Toast'
import { useSearch } from '../context/SearchContext'
import { EmptyState } from '../components/ui/EmptyState'

interface SubjectBook {
  title: string
  code: string
  spineColor: string
  height: string
  pages: number
  progress: number
}

const Bookshelf: React.FC = () => {
  const { showToast } = useToast()
  const { searchQuery } = useSearch()

  const [books, setBooks] = useState<SubjectBook[]>([
    { title: 'DBMS', code: 'CS-302', spineColor: 'bg-[#2F5D50]', height: 'h-[135px]', pages: 412, progress: 45 },
    { title: 'Operating Systems', code: 'CS-304', spineColor: 'bg-[#8B5E3C]', height: 'h-[145px]', pages: 520, progress: 60 },
    { title: 'Computer Networks', code: 'CS-306', spineColor: 'bg-[#C8A97E] text-text', height: 'h-[125px]', pages: 380, progress: 30 },
    { title: 'Cloud Computing', code: 'CS-401', spineColor: 'bg-[#40544f]', height: 'h-[130px]', pages: 310, progress: 75 },
    { title: 'Data Structures', code: 'CS-201', spineColor: 'bg-[#5c4a3c]', height: 'h-[140px]', pages: 480, progress: 90 },
    { title: 'Compiler Design', code: 'CS-405', spineColor: 'bg-[#1E293B]', height: 'h-[138px]', pages: 450, progress: 15 },
    { title: 'Software Engineering', code: 'CS-208', spineColor: 'bg-[#78350F]', height: 'h-[132px]', pages: 360, progress: 50 },
  ])

  // Book animation modal states
  const [selectedBook, setSelectedBook] = useState<SubjectBook | null>(null)
  const [isBookOpen, setIsBookOpen] = useState(false)
  const [isPageFlipped, setIsPageFlipped] = useState(false)

  const handleAddVolume = () => {
    const mockOptions = [
      { title: 'Distributed Systems', code: 'CS-412', spineColor: 'bg-[#2B3E50]', height: 'h-[142px]', pages: 610, progress: 10 },
      { title: 'Machine Learning', code: 'CS-450', spineColor: 'bg-[#5C7E5C]', height: 'h-[136px]', pages: 540, progress: 25 },
      { title: 'Automata Theory', code: 'CS-301', spineColor: 'bg-[#8F6A3C]', height: 'h-[130px]', pages: 400, progress: 40 },
    ]

    // Select option that isn't already added
    const available = mockOptions.filter(opt => !books.some(b => b.title === opt.title))
    
    if (available.length === 0) {
      showToast('All sample curriculum volumes have been added to your bookshelf.')
      return
    }

    const nextBook = available[0]
    setBooks([...books, nextBook])
    showToast(`Successfully checked out: ${nextBook.title} (${nextBook.code}).`)
  }

  // Filter books based on search query
  const filteredBooks = books.filter(
    (b) =>
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.code.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleBookClick = (book: SubjectBook) => {
    setSelectedBook(book)
    setIsPageFlipped(false)
    setIsBookOpen(false)
    setTimeout(() => {
      setIsBookOpen(true)
    }, 150)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-serif text-text mb-1">My Bookshelf</h1>
          <p className="text-sm text-text/60 font-sans">
            Catalog, track, and annotate books and digital journal papers. Click a volume to read outlines.
          </p>
        </div>
        <Button
          variant="accent"
          size="sm"
          className="flex items-center gap-2 cursor-pointer"
          onClick={handleAddVolume}
        >
          <Plus className="w-4 h-4" /> Add Volume
        </Button>
      </div>

      {filteredBooks.length === 0 ? (
        <EmptyState
          title="No matching books found."
          description={`I couldn't find any textbooks or journals matching "${searchQuery}". Let's double check our library catalog indexes.`}
        />
      ) : (
        <div className="space-y-12 py-4">
          
          {/* Wooden Shelf Display */}
          <div className="bg-card border border-border p-8 pb-4 rounded-[10px] shadow-[0_4px_16px_rgba(139,94,60,0.06)] flex flex-col justify-end min-h-[260px] relative">
            <div className="absolute top-4 left-4 text-[9px] font-bold text-accent uppercase tracking-wider font-mono">
              University Library Catalog
            </div>

            {/* Stand/Books Area */}
            <div className="flex flex-wrap justify-center items-end px-4 gap-4 flex-grow h-[155px] mb-1">
              {filteredBooks.map((book, idx) => (
                <motion.div
                  key={book.title}
                  onClick={() => handleBookClick(book)}
                  whileHover={{
                    y: -16,
                    rotate: 3,
                    boxShadow: '4px 8px 16px rgba(139, 94, 60, 0.25)'
                  }}
                  transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                  className={`group relative w-12 ${book.height} ${book.spineColor} text-white border-r-4 border-black/10 border-t-2 rounded-t-[4px] shadow-[2px_-2px_6px_rgba(0,0,0,0.15)] flex flex-col justify-between items-center py-3.5 cursor-pointer`}
                >
                  {/* Bookmark ribbon */}
                  {idx % 4 === 1 && (
                    <div className="absolute top-0 right-2 w-1.5 h-6 bg-accent border-b border-accent/80 rounded-b-sm" />
                  )}

                  {/* Hover Tooltip Info */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2.5 bg-text text-white text-[9px] px-2.5 py-1 rounded-[6px] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10 shadow-md">
                    <p className="font-semibold">{book.title}</p>
                    <p className="text-white/70">{book.progress}% read ({book.pages} pp.)</p>
                  </div>

                  {/* Top Code index */}
                  <span className="text-[7px] tracking-widest font-mono text-white/50">{book.code.split('-')[1]}</span>

                  {/* Spine Vertical Title */}
                  <span
                    className="text-[9px] font-bold tracking-wider font-serif text-center uppercase truncate max-h-[120px] select-none"
                    style={{
                      writingMode: 'vertical-rl',
                      transform: 'rotate(180deg)',
                    }}
                  >
                    {book.title}
                  </span>

                  {/* Bottom separator stripe */}
                  <div className="w-5 h-0.5 bg-white/20"></div>
                </motion.div>
              ))}
            </div>

            {/* Wooden Shelf Base */}
            <div className="h-5 bg-[#C8A97E] border-t border-[#bfa277] rounded-[2px] shadow-[0_4px_8px_rgba(0,0,0,0.08)] relative">
              {/* Wood grain highlight */}
              <div className="absolute inset-x-0 bottom-0 h-1 bg-[#8B5E3C]/25" />
              <div className="absolute inset-x-0 top-0.5 h-[1px] bg-white/20" />
            </div>
          </div>

          {/* Catalog Grid View for secondary reference */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBooks.map((book) => (
              <Card key={book.title} className="p-5 bg-card hover:border-primary/40 transition-colors flex justify-between items-center group">
                <div className="space-y-1">
                  <span className="text-[9px] font-bold text-accent uppercase tracking-wider font-mono bg-accent/10 px-2 py-0.5 rounded-sm">
                    {book.code}
                  </span>
                  <h3 className="font-serif font-bold text-sm text-text mt-1">{book.title}</h3>
                  <p className="text-[10px] text-text/50 font-sans">{book.pages} pages &bull; {book.progress}% complete</p>
                </div>
                <Button
                  onClick={() => handleBookClick(book)}
                  variant="outline"
                  size="sm"
                  className="px-3 h-8 text-[10px] uppercase font-bold tracking-wider font-sans flex items-center gap-1 cursor-pointer"
                >
                  <span>Open</span>
                  <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </Button>
              </Card>
            ))}
          </div>

        </div>
      )}

      {/* 3D Hardcover Book Opening Modal */}
      <AnimatePresence>
        {selectedBook && (
          <div className="fixed inset-0 z-50 bg-text/40 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="absolute inset-0 cursor-pointer" onClick={() => setSelectedBook(null)} />
            
            {/* Book Body Container */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0, rotateY: 20 }}
              animate={{ scale: 1, opacity: 1, rotateY: 0 }}
              exit={{ scale: 0.9, opacity: 0, rotateY: 20 }}
              transition={{ duration: 0.4 }}
              className="relative w-full max-w-2xl aspect-[3/2] bg-[#FAF8F5] dark:bg-[#2B2723] rounded-[10px] shadow-2xl overflow-hidden flex border border-border"
              style={{ perspective: '1500px' }}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedBook(null)}
                className="absolute top-3 right-3 z-40 p-1.5 text-text/50 hover:text-text hover:bg-secondary/15 rounded-[10px] cursor-pointer"
                aria-label="Close Book"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Book Center Groove Spine */}
              <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-2 bg-gradient-to-r from-black/15 via-black/30 to-black/15 z-20" />

              {/* LEFT PAGE (Static book info, styled like real paper) */}
              <div className="flex-1 p-8 pr-10 flex flex-col justify-between select-none border-r border-border/30 bg-[#FAF8F5] dark:bg-[#2B2723] z-10">
                <div className="space-y-4">
                  <span className="text-[10px] font-bold text-accent uppercase tracking-wider font-sans">
                    {selectedBook.code} &bull; Textbook Edition
                  </span>
                  <h2 className="text-2xl font-bold font-serif text-text leading-tight">{selectedBook.title}</h2>
                  <div className="h-0.5 bg-primary/25 w-16" />
                  
                  <p className="text-xs text-text/60 font-sans leading-relaxed">
                    Welcome to the digital transcript for {selectedBook.title}. This volume indexes all course modules, lecture slides, and AI-generated quiz indices.
                  </p>
                </div>
                
                <div className="space-y-2 font-sans">
                  <div className="flex items-center justify-between text-xs text-text/60">
                    <span>Reading Progress</span>
                    <span className="font-semibold text-text">{selectedBook.progress}%</span>
                  </div>
                  <div className="w-full bg-background rounded-full h-1.5 border border-border/60">
                    <div className="bg-primary h-1.5 rounded-full" style={{ width: `${selectedBook.progress}%` }} />
                  </div>
                  <p className="text-[9px] text-text/45">Page {Math.round(selectedBook.pages * selectedBook.progress / 100)} of {selectedBook.pages} pages read</p>
                </div>
              </div>

              {/* RIGHT PAGE (Contains outlines or annotations) */}
              <div className="flex-1 p-8 pl-10 flex flex-col justify-between relative bg-[#F5F1EB] dark:bg-[#25211D] z-10">
                
                {!isPageFlipped ? (
                  /* Page 2 contents */
                  <div className="space-y-3">
                    <h4 className="font-serif font-bold text-xs text-text border-b border-border/40 pb-1.5">Syllabus Outline</h4>
                    <div className="space-y-2.5 text-[11px] text-text/75 leading-relaxed font-sans">
                      <p>&bull; Module 1: Foundational Theoretical Frameworks</p>
                      <p>&bull; Module 2: Concurrency Controls & Thread Safety</p>
                      <p>&bull; Module 3: Virtual Memory & Page Tables</p>
                      <p>&bull; Module 4: Network Transport Optimizations</p>
                    </div>
                  </div>
                ) : (
                  /* Page 3 contents */
                  <div className="space-y-4">
                    <h4 className="font-serif font-bold text-sm text-text border-b border-border/40 pb-1.5">Chapter Synthesis</h4>
                    <p className="text-xs text-text/60 font-sans leading-relaxed">
                      Every lecture module in this catalog has been synthesized by Quill. You can generate custom quizzes or review summaries directly inside the portals.
                    </p>
                    
                    <div className="p-3 bg-card border border-border rounded-[10px] space-y-1">
                      <p className="text-[10px] font-bold text-text">AI Recommendation:</p>
                      <p className="text-[9px] text-text/50 font-sans leading-normal">
                        Prepare a practice flashcard quiz for Module 2 to solidify memory retention before deadlines.
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between mt-auto z-20">
                  <button
                    onClick={() => setIsPageFlipped(!isPageFlipped)}
                    className="text-[10px] font-bold text-primary hover:text-primary/80 flex items-center gap-1 font-sans cursor-pointer focus:outline-none"
                  >
                    {isPageFlipped ? 'Syllabus Outline' : 'Chapter Synthesis'} <ChevronRight className={`w-3 h-3 transition-transform ${isPageFlipped ? 'rotate-180' : ''}`} />
                  </button>
                  <span className="text-[9px] text-text/40 font-mono">{isPageFlipped ? 'Page 3' : 'Page 2'}</span>
                </div>
              </div>

              {/* 3D HARDCOVER COVER FLIP OVERLAY */}
              <motion.div
                initial={{ rotateY: 0 }}
                animate={{ rotateY: isBookOpen ? -180 : 0 }}
                transition={{ duration: 0.8, ease: 'easeInOut' }}
                className="absolute top-0 bottom-0 right-0 w-1/2 origin-left z-30 shadow-2xl overflow-hidden"
                style={{
                  transformStyle: 'preserve-3d',
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                  borderTopRightRadius: '10px',
                  borderBottomRightRadius: '10px'
                }}
              >
                {/* Cover Outer Face (Visible when rotateY is between 0 and -90) */}
                <div
                  className={`absolute inset-0 ${selectedBook.spineColor} p-8 flex flex-col justify-between text-white border-l-8 border-black/20`}
                  style={{
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                    transform: 'rotateY(0deg)'
                  }}
                >
                  <div className="space-y-4">
                    <span className="text-[10px] font-mono tracking-widest text-white/60 uppercase">{selectedBook.code}</span>
                    <h3 className="text-2xl font-serif font-bold leading-tight mt-6 text-white">{selectedBook.title}</h3>
                    <div className="w-16 h-0.5 bg-[#C8A97E]/60 mt-4" />
                  </div>
                  <div className="flex items-center justify-between text-[9px] font-sans font-bold text-white/50 uppercase tracking-widest border-t border-white/10 pt-4">
                    <span>StudentHub AI</span>
                    <span>Press to study</span>
                  </div>
                </div>

                {/* Cover Inner Face (Visible when rotateY is between -90 and -180) */}
                <div
                  className="absolute inset-0 bg-[#FAF8F5] dark:bg-[#2B2723] p-8 border-r border-border/30 flex flex-col justify-between"
                  style={{
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)'
                  }}
                >
                  <div className="space-y-4">
                    <span className="text-[10px] font-mono tracking-widest text-text/40 uppercase">Internal Ledger Index</span>
                    <h3 className="text-xl font-serif font-bold text-text leading-tight mt-4">Volume Documentation</h3>
                    <div className="h-px bg-border/40 w-full my-4" />
                    <p className="text-[10px] text-text/50 font-sans leading-relaxed">
                      This archived volume houses the course modules and annotations. Opening the hardcover synchronizes your reading log with the college registry database.
                    </p>
                  </div>
                  <div className="text-[9px] text-text/40 font-mono">
                    Inside Front Cover
                  </div>
                </div>
              </motion.div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  )
}

export default Bookshelf
