import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { useToast } from '../components/ui/Toast'
import { useSearch } from '../context/SearchContext'
import { QuillMascot } from '../components/ui/QuillMascot'
import { EmptyState } from '../components/ui/EmptyState'
import {
  BookOpen,
  Cpu,
  FileText,
  Calendar as CalendarIcon,
  Compass,
  FileCode,
  Flame,
  Sparkles,
  ClipboardCheck,
  ChevronRight,
  History,
  FileDown,
  X
} from 'lucide-react'

interface Quote {
  text: string
  author: string
}

interface SubjectBook {
  title: string
  code: string
  spineColor: string
  height: string
  pages: number
  progress: number
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const { searchQuery } = useSearch()

  const readingTime = 45
  const dailyGoal = 60

  const quote: Quote = {
    text: "Books are the quietest and most constant of friends; they are the most accessible and wisest of counselors, and the most patient of teachers.",
    author: "Charles William Eliot"
  }

  const subjects: SubjectBook[] = [
    { title: 'DBMS', code: 'CS-302', spineColor: 'bg-[#2F5D50]', height: 'h-[135px]', pages: 412, progress: 45 },
    { title: 'Operating Systems', code: 'CS-304', spineColor: 'bg-[#8B5E3C]', height: 'h-[145px]', pages: 520, progress: 60 },
    { title: 'Computer Networks', code: 'CS-306', spineColor: 'bg-[#C8A97E] text-text', height: 'h-[125px]', pages: 380, progress: 30 },
    { title: 'Cloud Computing', code: 'CS-401', spineColor: 'bg-[#40544f]', height: 'h-[130px]', pages: 310, progress: 75 },
    { title: 'Data Structures', code: 'CS-201', spineColor: 'bg-[#5c4a3c]', height: 'h-[140px]', pages: 480, progress: 90 },
  ]

  const recentAIActivities = [
    { action: 'Summarized Chapter 4', target: 'Operating Systems', time: '2 hours ago', icon: Sparkles, color: 'text-accent bg-accent/10' },
    { action: 'Generated Study Flashcards', target: 'DBMS Basics', time: '5 hours ago', icon: ClipboardCheck, color: 'text-primary bg-primary/10' },
    { action: 'Extracted Definitions', target: 'Computer Networks', time: 'Yesterday', icon: FileCode, color: 'text-accent bg-accent/10' },
  ]

  const recentDocuments = [
    { name: 'lecture3_virtual_memory.pdf', size: '2.4 MB', date: 'Jul 14', type: 'PDF' },
    { name: 'dbms_query_optimization.md', size: '15 KB', date: 'Jul 12', type: 'MD' },
    { name: 'tcp_congestion_control.pdf', size: '1.8 MB', date: 'Jul 11', type: 'PDF' },
  ]

  const quickActions = [
    { title: 'Summarize Notes', desc: 'Distill PDF text to markdown summaries', icon: Sparkles },
    { title: 'Generate Quiz', desc: 'Create study flashcards from catalog documents', icon: ClipboardCheck },
    { title: 'Study Planner', desc: 'Plan reading milestones and timeline tasks', icon: Compass },
    { title: 'Assignment Helper', desc: 'Explain complex reference book problems', icon: Cpu },
  ]

  // Book animation modal states
  const [selectedBook, setSelectedBook] = useState<SubjectBook | null>(null)
  const [isBookOpen, setIsBookOpen] = useState(false)
  const [isPageFlipped, setIsPageFlipped] = useState(false)

  const handleActionClick = (title: string) => {
    if (title === 'Summarize Notes') navigate('/notes')
    else if (title === 'Generate Quiz') navigate('/quiz')
    else if (title === 'Study Planner') navigate('/planner')
    else if (title === 'Assignment Helper') navigate('/assignment-helper')
  }

  // Filter content based on search query
  const query = searchQuery.toLowerCase()
  const filteredSubjects = subjects.filter(
    (b) => b.title.toLowerCase().includes(query) || b.code.toLowerCase().includes(query)
  )
  const filteredActivities = recentAIActivities.filter(
    (a) => a.action.toLowerCase().includes(query) || a.target.toLowerCase().includes(query)
  )
  const filteredDocuments = recentDocuments.filter(
    (d) => d.name.toLowerCase().includes(query) || d.type.toLowerCase().includes(query)
  )

  const hasResults =
    filteredSubjects.length > 0 ||
    filteredActivities.length > 0 ||
    filteredDocuments.length > 0

  const handleBookClick = (book: SubjectBook) => {
    setSelectedBook(book)
    setIsPageFlipped(false)
    setIsBookOpen(false)
    setTimeout(() => {
      setIsBookOpen(true)
    }, 150)
  }

  const handleDisabledAction = () => {
    showToast('This archival task is currently locked. Connect AI core to run.')
  }

  return (
    <div className="space-y-6">
      
      {/* 1. Welcome Banner & Mascot Greeting */}
      <div className="bg-card border border-border rounded-[10px] p-6 shadow-[0_2px_8px_-3px_rgba(139,94,60,0.06)] flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        {/* Decorative corner accent */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-secondary/10 rounded-bl-full pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-center gap-5 max-w-xl">
          <QuillMascot size={72} mood="happy" className="flex-shrink-0" />
          <div className="space-y-1.5 text-center sm:text-left">
            <span className="text-[10px] font-bold text-accent tracking-wider uppercase bg-accent/15 px-2.5 py-0.5 rounded-[10px]">
              Hi! I'm Quill
            </span>
            <h1 className="text-2xl font-bold tracking-tight font-serif text-text">
              Ready for another productive study session?
            </h1>
            <p className="text-xs text-text/60 font-sans leading-relaxed">
              Your premium digital study catalog is fully indexed. Your notes, papers, and AI study assistants are ready in a quiet room setting.
            </p>
          </div>
        </div>

        {/* Vertical divider */}
        <div className="hidden md:block w-px self-stretch bg-border/60" />

        {/* Quote of the Day */}
        <div className="flex-1 max-w-sm">
          <p className="text-xs font-serif italic text-text/70 leading-relaxed relative">
            <span className="text-lg font-serif text-primary absolute -left-3.5 -top-1">“</span>
            {quote.text}
            <span className="text-lg font-serif text-primary">”</span>
          </p>
          <p className="text-[10px] font-sans font-bold text-text/50 uppercase tracking-wider mt-2.5 text-right font-semibold">
            — {quote.author}
          </p>
        </div>
      </div>

      {!hasResults ? (
        <EmptyState
          title="No matching catalog items found."
          description={`I couldn't find any books, documents, or activities matching "${searchQuery}". Let's try searching for another library item.`}
        />
      ) : (
        /* Grid Layout: Main Columns */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left/Center Column (2/3 width) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Continue Reading & Today's Study Progress Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Continue Reading */}
              <Card className="flex flex-col justify-between bg-card">
                <CardHeader className="pb-2">
                  <p className="text-[10px] font-bold text-accent uppercase tracking-wider font-sans">
                    Active Reading
                  </p>
                  <CardTitle className="text-base font-serif font-bold">
                    Operating Systems
                  </CardTitle>
                  <CardDescription>
                    Chapter 4: Scheduling Policies & Context Switching
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Book progress */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs text-text/60 font-sans">
                      <span>Progress: 312 / 520 pages</span>
                      <span className="font-semibold text-text">60%</span>
                    </div>
                    <div className="w-full bg-background rounded-full h-1.5 border border-border/60">
                      <div className="bg-primary h-1.5 rounded-full" style={{ width: '60%' }}></div>
                    </div>
                  </div>

                  <Button 
                    onClick={() => navigate('/reading-room')}
                    variant="secondary" 
                    size="sm" 
                    className="w-full text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <BookOpen className="w-3.5 h-3.5" /> Continue Reading
                  </Button>
                </CardContent>
              </Card>

              {/* Today's Study Progress */}
              <Card className="flex flex-col justify-between bg-card">
                <CardHeader className="pb-2">
                  <p className="text-[10px] font-bold text-primary uppercase tracking-wider font-sans">
                    Session Statistics
                  </p>
                  <CardTitle className="text-base font-serif font-bold">
                    Today's Reading Target
                  </CardTitle>
                  <CardDescription>
                    Daily focus time goal for study efficiency
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="space-y-1">
                      <p className="text-2xl font-bold text-text font-serif">
                        {readingTime} <span className="text-xs text-text/50 font-sans font-medium">min</span>
                      </p>
                      <p className="text-[10px] text-text/50">
                        Goal: {dailyGoal} min ({Math.round((readingTime / dailyGoal) * 100)}% met)
                      </p>
                    </div>
                    
                    {/* Visual Circle Meter */}
                    <div className="relative w-14 h-14 flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle cx="28" cy="28" r="24" className="stroke-border" strokeWidth="3" fill="transparent" />
                        <circle
                          cx="28"
                          cy="28"
                          r="24"
                          className="stroke-accent transition-all duration-300"
                          strokeWidth="3.5"
                          fill="transparent"
                          strokeDasharray={2 * Math.PI * 24}
                          strokeDashoffset={2 * Math.PI * 24 * (1 - Math.min(readingTime / dailyGoal, 1))}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute text-center flex flex-col items-center justify-center">
                        <Flame className="w-4 h-4 text-accent" />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-center text-[10px] text-text/60 border-t border-border/40 pt-3">
                    <div className="border-r border-border/40">
                      <p className="font-bold text-text">14 Pages</p>
                      <p>Read today</p>
                    </div>
                    <div>
                      <p className="font-bold text-text">3 hrs</p>
                      <p>Current streak</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* 2. Subjects Shelf (Wooden Bookshelf representation) */}
            {filteredSubjects.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif font-bold text-lg text-text">Study Bookshelf</h3>
                  <span className="text-xs text-text/55 font-medium">{filteredSubjects.length} volumes loaded</span>
                </div>

                {/* Wooden shelf layout */}
                <div className="bg-card border border-border p-6 pb-2 rounded-[10px] shadow-[0_2px_8px_-3px_rgba(139,94,60,0.06)] flex flex-col justify-end min-h-[220px]">
                  {/* Stand/Books Area */}
                  <div className="flex justify-center items-end px-4 gap-4 flex-grow h-[145px]">
                    {filteredSubjects.map((book, idx) => (
                      <motion.div
                        key={book.title}
                        onClick={() => handleBookClick(book)}
                        whileHover={{
                          y: -14,
                          rotate: 3,
                          boxShadow: '3px 6px 12px rgba(139, 94, 60, 0.2)'
                        }}
                        transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                        className={`group relative w-12 ${book.height} ${book.spineColor} text-white border-r-4 border-black/10 border-t-2 rounded-t-[4px] shadow-[2px_-2px_6px_rgba(0,0,0,0.15)] flex flex-col justify-between items-center py-3 cursor-pointer`}
                      >
                        {/* Bookmark ribbon */}
                        {idx === 1 && (
                          <div className="absolute top-0 right-2 w-1.5 h-6 bg-accent border-b border-accent/80 rounded-b-sm" />
                        )}

                        {/* Hover Tooltip Info */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-text text-white text-[9px] px-2 py-1 rounded-[6px] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10 shadow-md">
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
                  <div className="h-4.5 bg-[#C8A97E] border-t border-[#bfa277] rounded-[2px] shadow-[0_3px_5px_rgba(0,0,0,0.08)] relative mt-0.5">
                    {/* Wood grain highlight */}
                    <div className="absolute inset-x-0 bottom-0 h-1 bg-[#8B5E3C]/25" />
                    <div className="absolute inset-x-0 top-0.5 h-[1px] bg-white/20" />
                  </div>
                </div>
              </div>
            )}

            {/* 3. Recent Documents */}
            {filteredDocuments.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif font-bold text-lg text-text">Recent Documents</h3>
                  <Button 
                    onClick={() => navigate('/bookshelf')}
                    variant="ghost" 
                    size="sm" 
                    className="text-xs font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    View All <ChevronRight className="w-3.5 h-3.5" />
                  </Button>
                </div>

                <Card className="bg-card">
                  <div className="divide-y divide-border/60">
                    {filteredDocuments.map((doc) => (
                      <div key={doc.name} className="p-4 flex items-center justify-between hover:bg-background/40 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-secondary/15 text-primary">
                            <FileText className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-text">{doc.name}</p>
                            <p className="text-[10px] text-text/50 font-sans">
                              {doc.size} &bull; Uploaded {doc.date}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] font-bold text-text/45 border border-border px-2 py-0.5 rounded-[10px] bg-background">
                            {doc.type}
                          </span>
                          <Button 
                            onClick={handleDisabledAction}
                            variant="ghost" 
                            size="sm" 
                            className="p-2 h-auto text-text/50 hover:text-primary cursor-pointer"
                          >
                            <FileDown className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            )}

          </div>

          {/* Right Column (1/3 width) */}
          <div className="space-y-6">

            {/* 1. Mascot Study Tip Widget (Wise Mascot Desk) */}
            <Card className="p-5 bg-card border-accent/25 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 bg-accent/5 rounded-bl-full pointer-events-none" />
              <div className="flex items-start gap-4">
                <QuillMascot size={48} mood="reading" className="flex-shrink-0 mt-0.5" />
                <div className="space-y-2">
                  <h4 className="font-serif font-bold text-xs text-accent uppercase tracking-wider">
                    Quill's Wisdom Tip
                  </h4>
                  <p className="text-xs font-serif italic text-text/75 leading-relaxed">
                    "Every page you read brings you closer to your goals. Take short 5-minute Pomodoro breaks to organize concepts in your memory."
                  </p>
                  <p className="text-[9px] text-text/45 font-sans font-bold">— Library Ledger CS-1</p>
                </div>
              </div>
            </Card>

            {/* 2. Quick Actions */}
            <div className="space-y-3">
              <h3 className="font-serif font-bold text-lg text-text">Quick Actions</h3>
              <div className="grid grid-cols-1 gap-3">
                {quickActions.map((action) => {
                  const Icon = action.icon
                  return (
                    <button
                      key={action.title}
                      onClick={() => handleActionClick(action.title)}
                      className="w-full text-left p-4 bg-card border border-border rounded-[10px] shadow-[0_1.5px_4px_-1px_rgba(139,94,60,0.04)] hover:border-primary/50 hover:bg-secondary/5 transition-all duration-200 group flex items-start gap-3.5 cursor-pointer"
                    >
                      <div className="p-2 rounded-[10px] bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                        <Icon className="w-4.5 h-4.5" />
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-xs font-bold text-text group-hover:text-primary transition-colors">
                          {action.title}
                        </p>
                        <p className="text-[10px] text-text/50 leading-normal font-sans">
                          {action.desc}
                        </p>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* 3. Calendar Block */}
            <Card className="p-5 bg-card">
              <div className="flex items-center justify-between mb-4 border-b border-border/55 pb-3">
                <h4 className="font-serif font-bold text-sm text-text flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4 text-primary" /> Study Schedule
                </h4>
                <span className="text-[10px] font-sans font-semibold text-accent bg-accent/15 px-2 py-0.5 rounded-[10px]">
                  July 2026
                </span>
              </div>

              {/* Visual calendar strip */}
              <div className="grid grid-cols-7 gap-1.5 text-center mb-4">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, idx) => (
                  <span key={idx} className="text-[9px] font-bold text-text/40">{d}</span>
                ))}
                {[12, 13, 14, 15, 16, 17, 18].map((day, idx) => {
                  const isToday = day === 15
                  return (
                    <div
                      key={idx}
                      className={`p-1.5 rounded-[6px] text-xs font-sans font-semibold flex flex-col items-center justify-center ${
                        isToday
                          ? 'bg-accent text-white shadow-sm'
                          : 'hover:bg-secondary/15 text-text/75 cursor-pointer'
                      }`}
                    >
                      <span>{day}</span>
                      {idx % 3 === 0 && !isToday && (
                        <span className="w-1 h-1 bg-primary rounded-full mt-0.5" />
                      )}
                    </div>
                  )
                })}
              </div>

              {/* Schedule Items */}
              <div className="space-y-3 pt-2">
                <div className="border-l-2 border-primary pl-3 py-0.5 space-y-0.5">
                  <p className="text-[10px] font-bold text-text">DBMS Quiz Prep</p>
                  <p className="text-[9px] text-text/50">14:00 - 15:30 &bull; 3 topics remaining</p>
                </div>
                <div className="border-l-2 border-accent pl-3 py-0.5 space-y-0.5">
                  <p className="text-[10px] font-bold text-text">Network Protocols Reading</p>
                  <p className="text-[9px] text-text/50">16:30 - 18:00 &bull; Chapter 3 TCP/UDP</p>
                </div>
              </div>
            </Card>

            {/* 4. Recent AI Activities */}
            {filteredActivities.length > 0 && (
              <Card className="p-5 bg-card">
                <h4 className="font-serif font-bold text-sm text-text flex items-center gap-2 border-b border-border/55 pb-3 mb-4">
                  <History className="w-4 h-4 text-primary" /> Recent AI Log
                </h4>
                <div className="space-y-4">
                  {filteredActivities.map((act, idx) => {
                    const Icon = act.icon
                    return (
                      <div key={idx} className="flex gap-3 items-start">
                        <div className={`p-2 rounded-lg ${act.color} self-start`}>
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <div className="space-y-0.5">
                          <p className="text-xs font-semibold text-text leading-tight">{act.action}</p>
                          <p className="text-[9px] text-text/50">
                            {act.target} &bull; {act.time}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </Card>
            )}

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

export default Dashboard
