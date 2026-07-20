import React, { useState, useEffect } from 'react'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Loading } from '../components/ui/Loading'
import { useSearch } from '../context/SearchContext'
import { EmptyState } from '../components/ui/EmptyState'
import { useToast } from '../components/ui/Toast'
import { generatePlanner, getApiErrorMessage } from '../services/api'
import type { PlannerDay } from '../types/api'
import {
  Compass,
  Play,
  Pause,
  RotateCcw,
  Plus,
  Trash2,
  Clock,
  GraduationCap,
  Sparkles,
  RefreshCw
} from 'lucide-react'

// Pomodoro Timer types
type TimerMode = 'work' | 'break'

// Sticky Note interface
interface StickyNoteItem {
  id: string
  text: string
  color: string // bg color classes
}

// Stacked Book interface
interface StackedBook {
  title: string
  pages: number
  read: number
  color: string // bg color classes
  thickness: string // height
  width: string // width classes
  offset: string // margin classes
}

const StudyPlanner: React.FC = () => {
  // --- Pomodoro State ---
  const [timeLeft, setTimeLeft] = useState(1500) // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false)
  const [timerMode, setTimerMode] = useState<TimerMode>('work')

  useEffect(() => {
    let interval: number | null = null

    if (isRunning) {
      interval = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false)
            // Toggle mode
            if (timerMode === 'work') {
              setTimerMode('break')
              return 300 // 5 minutes break
            } else {
              setTimerMode('work')
              return 1500 // 25 minutes work
            }
          }
          return prev - 1
        })
      }, 1000)
    } else {
      if (interval) clearInterval(interval)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isRunning, timerMode])

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleStartPause = () => {
    setIsRunning(!isRunning)
  }

  const handleReset = () => {
    setIsRunning(false)
    setTimeLeft(timerMode === 'work' ? 1500 : 300)
  }

  const handleSetMode = (mode: TimerMode) => {
    setIsRunning(false)
    setTimerMode(mode)
    setTimeLeft(mode === 'work' ? 1500 : 300)
  }

  // --- Sticky Notes State ---
  const [stickyNotes, setStickyNotes] = useState<StickyNoteItem[]>([
    { id: '1', text: 'Evict old cache frames in OS lab before Thursday!', color: 'bg-[#FEFCD7] border-amber-200 text-amber-800' },
    { id: '2', text: 'Database exam will cover B+ Tree indexing splits.', color: 'bg-[#E3F4EC] border-emerald-200 text-emerald-800' },
    { id: '3', text: 'Generate UDP checksum quiz questions in AI tutor.', color: 'bg-[#FBE4E4] border-rose-200 text-rose-800' },
  ])
  const [noteInput, setNoteInput] = useState('')

  const handleAddNote = () => {
    if (!noteInput.trim()) return
    const colors = [
      'bg-[#FEFCD7] border-amber-200 text-amber-800',
      'bg-[#E3F4EC] border-emerald-200 text-emerald-800',
      'bg-[#FBE4E4] border-rose-200 text-rose-800',
    ]
    const newNote: StickyNoteItem = {
      id: Date.now().toString(),
      text: noteInput,
      color: colors[stickyNotes.length % colors.length]
    }
    setStickyNotes([...stickyNotes, newNote])
    setNoteInput('')
  }

  const handleDeleteNote = (id: string) => {
    setStickyNotes(stickyNotes.filter(n => n.id !== id))
  }

  // --- AI Study Plan Generator State ---
  const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
  const { showToast } = useToast()
  const [planSubject, setPlanSubject] = useState('Operating Systems')
  const [planExamDate, setPlanExamDate] = useState(tomorrow)
  const [planHoursPerDay, setPlanHoursPerDay] = useState(2)
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false)
  const [generatedPlan, setGeneratedPlan] = useState<PlannerDay[] | null>(null)

  const handleGeneratePlan = async () => {
    if (!planSubject.trim() || !planExamDate) return

    setIsGeneratingPlan(true)

    try {
      const data = await generatePlanner(planSubject, planExamDate, planHoursPerDay)
      setGeneratedPlan(data.daily_plan)
    } catch (error) {
      showToast(getApiErrorMessage(error))
    } finally {
      setIsGeneratingPlan(false)
    }
  }

  // --- Stacked Books (Horizontal stack on desk) ---
  const bookStack: StackedBook[] = [
    { title: 'Cloud Computing', pages: 310, read: 232, color: 'bg-[#334155]', thickness: 'h-6', width: 'w-44', offset: 'translate-x-3' },
    { title: 'Computer Networks', pages: 380, read: 114, color: 'bg-[#C8A97E] text-text border border-[#bca178]', thickness: 'h-7.5', width: 'w-52', offset: '-translate-x-1.5' },
    { title: 'DBMS', pages: 412, read: 185, color: 'bg-[#2F5D50]', thickness: 'h-7', width: 'w-56', offset: 'translate-x-2' },
    { title: 'Operating Systems', pages: 520, read: 312, color: 'bg-[#8B5E3C]', thickness: 'h-8.5', width: 'w-60', offset: '-translate-x-2.5' },
    { title: 'Data Structures', pages: 480, read: 432, color: 'bg-[#1e293b]', thickness: 'h-8', width: 'w-64', offset: 'translate-x-1' },
  ]

  const { searchQuery } = useSearch()

  const upcomingExams = [
    { subject: 'DBMS Indexing Seminars', date: 'July 18', daysLeft: 3, color: 'border-[#C8A97E]' },
    { subject: 'Operating Systems Finals', date: 'July 24', daysLeft: 9, color: 'border-[#8B5E3C]' },
  ]

  const timelineMilestones = [
    { time: '09:00 AM', task: 'Review virtual memory registers', status: 'done' },
    { time: '11:30 AM', task: 'Solve 2 practice questions in Quiz Hall', status: 'current' },
    { time: '03:00 PM', task: 'Summarize DBMS B-Tree splits', status: 'pending' },
  ]

  const filteredExams = upcomingExams.filter(exam =>
    exam.subject.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredMilestones = timelineMilestones.filter(mil =>
    mil.task.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredNotes = stickyNotes.filter(note =>
    note.text.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const hasResults = filteredExams.length > 0 || filteredMilestones.length > 0 || filteredNotes.length > 0

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-serif text-text mb-1">Study Planner</h1>
        <p className="text-sm text-text/60 font-sans">
          Organize your daily milestones, set targets, and trigger focus intervals on your study desk.
        </p>
      </div>

      {!hasResults && searchQuery !== '' ? (
        <EmptyState
          title="No matching tasks found."
          description={`I couldn't find any study milestones, deadlines, or sticky notes matching "${searchQuery}".`}
        />
      ) : (
        /* WOODEN STUDY DESK GRID */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN: Books Stack, Pomodoro, and Reading Goals */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Desk Base representation */}
          <div className="bg-card border border-border rounded-[10px] p-6 shadow-[0_4px_12px_rgba(139,94,60,0.04)] relative">
            <div className="absolute top-0 left-0 w-2 h-full bg-[#8B5E3C]/20 border-r border-[#8B5E3C]/10 rounded-l-[10px]" />
            
            <div className="pl-4 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              {/* Left inner: Stacked Books on Desk */}
              <div className="space-y-4">
                <div>
                  <h4 className="font-serif font-bold text-sm text-text">Syllabus Stack</h4>
                  <p className="text-[10px] text-text/50 font-sans">Horizontal volume stacks lying on your desk</p>
                </div>
                
                {/* Visual Stack container */}
                <div className="flex flex-col items-center justify-end min-h-[200px] border-b-4 border-[#C8A97E] pb-0.5">
                  {bookStack.map((book) => {
                    const pct = Math.round((book.read / book.pages) * 100)
                    return (
                      <div
                        key={book.title}
                        className={`group relative text-[9px] font-bold text-white flex items-center justify-center cursor-pointer transition-all duration-300 hover:-translate-y-1.5 hover:shadow-md rounded-sm select-none ${book.thickness} ${book.width} ${book.offset} ${book.color}`}
                      >
                        {/* Tooltip detail */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 bg-text text-white text-[8px] px-2 py-0.5 rounded-[4px] opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-10">
                          {book.title} ({pct}% read)
                        </div>

                        {/* Title text */}
                        <span className="truncate px-2 tracking-wide font-serif text-[10px]">{book.title}</span>

                        {/* Page edges highlight */}
                        <div className="absolute inset-y-0.5 right-0.5 w-1 bg-white/20 rounded-r-xs" />
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Right inner: Active Reading Goals */}
              <div className="space-y-4">
                <div>
                  <h4 className="font-serif font-bold text-sm text-text">Reading Goal Index</h4>
                  <p className="text-[10px] text-text/50 font-sans">Active volumes progress overview</p>
                </div>

                <div className="space-y-3.5">
                  {bookStack.slice(0, 3).map((book) => {
                    const pct = Math.round((book.read / book.pages) * 100)
                    return (
                      <div key={book.title} className="space-y-1.5 font-sans">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-semibold text-text">{book.title}</span>
                          <span className="text-text/50">{book.read}/{book.pages} pp. ({pct}%)</span>
                        </div>
                        <div className="w-full bg-background rounded-full h-1 border border-border/60">
                          <div className="bg-accent h-1 rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Pomodoro Focus Timer */}
          <div className="bg-card border border-border rounded-[10px] p-6 shadow-[0_2px_6px_rgba(139,94,60,0.04)]">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              
              {/* Clock representation */}
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-[10px] border border-border bg-background flex flex-col items-center justify-center text-primary font-bold shadow-inner">
                  <Clock className="w-6 h-6 text-primary/70" />
                </div>
                <div className="space-y-0.5">
                  <h4 className="font-serif font-bold text-base text-text">Pomodoro Desk Timer</h4>
                  <p className="text-xs text-text/50 font-sans leading-relaxed">
                    Trigger intervals of locked study focus ({timerMode === 'work' ? 'Study Block' : 'Break Time'}).
                  </p>
                </div>
              </div>

              {/* Mode toggles */}
              <div className="flex items-center gap-1.5 border border-border/80 p-1.5 bg-background rounded-[10px]">
                <button
                  onClick={() => handleSetMode('work')}
                  className={`px-3 py-1 rounded-[10px] text-[10px] font-bold tracking-wider uppercase transition-colors ${
                    timerMode === 'work'
                      ? 'bg-primary text-white'
                      : 'text-text/60 hover:text-primary hover:bg-white'
                  }`}
                  aria-label="Set Study focus mode (25 minutes)"
                >
                  Study (25m)
                </button>
                <button
                  onClick={() => handleSetMode('break')}
                  className={`px-3 py-1 rounded-[10px] text-[10px] font-bold tracking-wider uppercase transition-colors ${
                    timerMode === 'break'
                      ? 'bg-accent text-white'
                      : 'text-text/60 hover:text-accent hover:bg-white'
                  }`}
                  aria-label="Set Break recovery mode (5 minutes)"
                >
                  Break (5m)
                </button>
              </div>

            </div>

            {/* Timer Core Controls */}
            <div className="mt-6 p-6 bg-background border border-border/50 rounded-[10px] flex flex-col items-center justify-center gap-4">
              <div className="text-4xl md:text-5xl font-mono font-bold tracking-widest text-text">
                {formatTime(timeLeft)}
              </div>

              <div className="flex items-center gap-3">
                <Button
                  onClick={handleStartPause}
                  variant={isRunning ? 'outline' : 'primary'}
                  className="flex items-center gap-1.5 text-xs h-9 px-5"
                >
                  {isRunning ? (
                    <>
                      <Pause className="w-3.5 h-3.5" /> Pause Timer
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5" /> Start Focus
                    </>
                  )}
                </Button>
                <Button
                  onClick={handleReset}
                  variant="outline"
                  className="h-9 w-9 p-0 flex items-center justify-center"
                  title="Reset timer"
                  aria-label="Reset Pomodoro timer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          </div>

          {/* AI Study Plan Generator */}
          <Card className="p-6 space-y-5">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-accent/15 text-accent">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-serif font-bold text-sm text-text">AI Study Plan Generator</h4>
                <p className="text-[10px] text-text/50 font-sans">Generate a day-by-day revision schedule leading up to your exam.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-sans text-xs">
              <div className="space-y-1.5 md:col-span-1">
                <label className="text-[10px] font-bold text-text/50 uppercase tracking-wider">Subject</label>
                <input
                  type="text"
                  value={planSubject}
                  onChange={(e) => setPlanSubject(e.target.value)}
                  placeholder="e.g. Operating Systems"
                  className="w-full px-3.5 py-2 bg-background border border-border text-text rounded-[10px] focus:outline-none focus:border-primary/60 font-sans"
                />
              </div>
              <div className="space-y-1.5 md:col-span-1">
                <label className="text-[10px] font-bold text-text/50 uppercase tracking-wider">Exam Date</label>
                <input
                  type="date"
                  value={planExamDate}
                  min={tomorrow}
                  onChange={(e) => setPlanExamDate(e.target.value)}
                  className="w-full px-3.5 py-2 bg-background border border-border text-text rounded-[10px] focus:outline-none focus:border-primary/60 font-sans"
                />
              </div>
              <div className="space-y-1.5 md:col-span-1">
                <label className="text-[10px] font-bold text-text/50 uppercase tracking-wider">Hours / Day</label>
                <input
                  type="number"
                  min={1}
                  max={24}
                  value={planHoursPerDay}
                  onChange={(e) => setPlanHoursPerDay(Number(e.target.value))}
                  className="w-full px-3.5 py-2 bg-background border border-border text-text rounded-[10px] focus:outline-none focus:border-primary/60 font-sans"
                />
              </div>
            </div>

            <Button
              onClick={handleGeneratePlan}
              variant="primary"
              size="sm"
              className="w-full h-9 text-xs font-semibold flex items-center justify-center gap-1.5"
              disabled={isGeneratingPlan || !planSubject.trim() || !planExamDate}
            >
              {isGeneratingPlan ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Building Study Plan...
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" /> Generate Study Plan
                </>
              )}
            </Button>

            {isGeneratingPlan ? (
              <Loading message="Mapping out your revision schedule..." />
            ) : generatedPlan && generatedPlan.length > 0 ? (
              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {generatedPlan.map((day, idx) => (
                  <div key={idx} className="p-3.5 border border-border/60 rounded-[10px] bg-background/25 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-text">{day.date}</span>
                      <span className="text-[9px] text-text/45 font-mono uppercase">Day {idx + 1}</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {day.topics.map((t, tIdx) => (
                        <span
                          key={tIdx}
                          className="text-[10px] font-semibold text-primary bg-secondary/15 px-2 py-0.5 rounded-[8px]"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                    <p className="text-[11px] text-text/70 leading-relaxed">{day.tasks}</p>
                  </div>
                ))}
              </div>
            ) : null}
          </Card>

        </div>

        {/* RIGHT COLUMN: Timeline, Exams, and Sticky Notes */}
        <div className="space-y-6">

          {/* Timeline Milestones */}
          <Card className="p-5">
            <h4 className="font-serif font-bold text-sm text-text border-b border-border/55 pb-3 mb-4 flex items-center gap-2">
              <Compass className="w-4 h-4 text-primary" /> Daily Timeline
            </h4>
            <div className="space-y-4">
              {filteredMilestones.map((mil, idx) => (
                <div key={idx} className="flex gap-3.5 relative">
                  {/* Line linker */}
                  {idx < timelineMilestones.length - 1 && (
                    <div className="absolute left-[5px] top-4.5 bottom-0 w-[1.5px] bg-border/60" />
                  )}
                  {/* Status node */}
                  <div
                    className={`w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0 z-10 border ${
                      mil.status === 'done'
                        ? 'bg-accent border-accent'
                        : mil.status === 'current'
                        ? 'bg-white border-primary ring-2 ring-primary/25'
                        : 'bg-white border-border'
                    }`}
                  />
                  <div className="space-y-0.5">
                    <p className={`text-xs font-semibold ${
                      mil.status === 'done' ? 'text-text/50 line-through' : 'text-text'
                    }`}>{mil.task}</p>
                    <p className="text-[9px] text-text/45 font-mono">{mil.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Upcoming Exams */}
          <Card className="p-5">
            <h4 className="font-serif font-bold text-sm text-text border-b border-border/55 pb-3 mb-4 flex items-center gap-2">
              <GraduationCap className="w-4.5 h-4.5 text-primary" /> Upcoming Deadlines
            </h4>
            <div className="space-y-3">
              {filteredExams.map((exam) => (
                <div
                  key={exam.subject}
                  className={`p-3.5 border-l-2 rounded-r-[8px] bg-background/25 flex items-center justify-between gap-3 ${exam.color}`}
                >
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-text leading-tight">{exam.subject}</p>
                    <p className="text-[9px] text-text/50">Date: {exam.date}</p>
                  </div>
                  <span className="text-[10px] font-sans font-bold text-accent bg-accent/10 px-2 py-0.5 rounded-[10px] whitespace-nowrap">
                    {exam.daysLeft} days left
                  </span>
                </div>
              ))}
            </div>
          </Card>

          {/* Sticky Notes Widget */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-lg text-text">Desk Sticky Notes</h4>
            
            {/* Notes List */}
            <div className="grid grid-cols-1 gap-3">
              {filteredNotes.map((note) => (
                <div
                  key={note.id}
                  className={`p-4 border rounded-[10px] shadow-sm relative group transition-transform duration-200 hover:-rotate-1 hover:shadow-md ${note.color}`}
                >
                  <p className="text-xs font-serif leading-relaxed pr-6">{note.text}</p>
                  <button
                    onClick={() => handleDeleteNote(note.id)}
                    className="absolute top-2 right-2 p-1 rounded-md text-text/30 hover:text-red-600 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity focus:outline-none"
                    title="Evict note"
                    aria-label="Delete study reminder note"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Note Input Add */}
            <div className="flex gap-2">
              <input
                type="text"
                value={noteInput}
                onChange={(e) => setNoteInput(e.target.value)}
                placeholder="Write a desktop reminder..."
                className="flex-grow px-3.5 py-2 text-xs bg-card border border-border text-text rounded-[10px] focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/25 font-sans"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAddNote()
                }}
              />
              <Button
                onClick={handleAddNote}
                variant="primary"
                className="p-2 h-[34px] w-[34px] flex items-center justify-center"
                aria-label="Add new study reminder note"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    )}
  </div>
  )
}

export default StudyPlanner
