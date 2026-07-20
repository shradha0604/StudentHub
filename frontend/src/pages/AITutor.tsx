import React, { useState, useRef, useEffect } from 'react'
import { Button } from '../components/ui/Button'
import ReactMarkdown from 'react-markdown'
import { useToast } from '../components/ui/Toast'
import { sendChatMessage, getApiErrorMessage } from '../services/api'
import {
  Bookmark,
  Copy,
  Send,
  Paperclip,
  BookmarkCheck,
  Check,
  Pin,
  MessageSquare,
  GraduationCap
} from 'lucide-react'

interface Message {
  id: string
  sender: 'student' | 'tutor'
  text: string
  timestamp: string
}

const AITutor: React.FC = () => {
  const { showToast } = useToast()
  const [messages, setMessages] = useState<Message[]>([])

  const [inputVal, setInputVal] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set())

  const chatEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  const handleSend = async () => {
    if (!inputVal.trim()) return

    const messageText = inputVal
    const studentMessage: Message = {
      id: Date.now().toString(),
      sender: 'student',
      text: messageText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    setMessages((prev) => [...prev, studentMessage])
    setInputVal('')
    setIsTyping(true)

    try {
      const { reply } = await sendChatMessage(messageText)
      const tutorMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'tutor',
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
      setMessages((prev) => [...prev, tutorMessage])
    } catch (error) {
      showToast(getApiErrorMessage(error))
    } finally {
      setIsTyping(false)
    }
  }

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleBookmark = (id: string) => {
    setBookmarkedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-10rem)] max-h-[800px]">
      
      {/* LEFT: Library Discussions Panel */}
      <div className="lg:col-span-1 border border-border bg-card rounded-[10px] p-4 flex flex-col justify-between overflow-y-auto">
        <div className="space-y-6">
          
          {/* Section: Active Session Title */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 rounded-lg bg-accent/15 text-accent">
                <GraduationCap className="w-4 h-4" />
              </div>
              <h3 className="font-serif font-bold text-sm text-text">AI Study Room</h3>
            </div>
            <p className="text-[10px] text-text/50 font-sans leading-relaxed">
              Consulting the virtual study desk. Ask questions about textbooks, catalog items, or assignment prompts.
            </p>
          </div>

          <div className="h-px bg-border/60" />

          {/* Conversation History */}
          <div className="space-y-2">
            <p className="text-[9px] font-bold text-text/40 tracking-wider uppercase flex items-center gap-1.5 px-2">
              <MessageSquare className="w-3 h-3 text-primary" /> Active Catalog Logs
            </p>
            <div className="space-y-1">
              {['OS Virtual Memory Paging', 'DBMS Normalization Forms', 'TCP Congestion Algorithms'].map((topic, idx) => (
                <button
                  key={topic}
                  onClick={() => idx !== 0 && showToast('This feature will be available after AI connection.')}
                  className={`w-full text-left px-2.5 py-2 rounded-[8px] text-[11px] font-medium transition-colors ${
                    idx === 0
                      ? 'bg-secondary/15 text-primary font-semibold'
                      : 'text-text/70 hover:bg-background'
                  }`}
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>

          {/* Saved Discussions */}
          <div className="space-y-2">
            <p className="text-[9px] font-bold text-text/40 tracking-wider uppercase flex items-center gap-1.5 px-2">
              <Bookmark className="w-3 h-3 text-accent" /> Saved Seminars
            </p>
            <div className="space-y-1">
              {['B-Tree Indirection Indexing', 'Context Switching Trap Costs'].map((topic) => (
                <button
                  key={topic}
                  onClick={() => showToast('This feature will be available after AI connection.')}
                  className="w-full text-left px-2.5 py-1.5 rounded-[8px] text-[11px] text-text/75 hover:bg-background transition-colors"
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>

          {/* Pinned Topics */}
          <div className="space-y-2">
            <p className="text-[9px] font-bold text-text/40 tracking-wider uppercase flex items-center gap-1.5 px-2">
              <Pin className="w-3 h-3 text-primary" /> Pinned Indexes
            </p>
            <div className="space-y-1">
              {['Operating Systems Final Exam', 'DBMS Project Guidelines'].map((topic) => (
                <button
                  key={topic}
                  onClick={() => showToast('This feature will be available after AI connection.')}
                  className="w-full text-left px-2.5 py-1.5 rounded-[8px] text-[11px] text-text/75 hover:bg-background transition-colors flex items-center justify-between"
                >
                  <span>{topic}</span>
                  <Pin className="w-2.5 h-2.5 text-text/30" />
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Room Status Indicator */}
        <div className="pt-4 border-t border-border/60 mt-4 text-[10px] text-text/50 font-sans flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          <span>Room 3B Desk Connected</span>
        </div>
      </div>

      {/* RIGHT: Study Conversation Area */}
      <div className="lg:col-span-3 flex flex-col justify-between h-full bg-background border border-border rounded-[10px] overflow-hidden">
        
        {/* Messages list */}
        <div className="flex-grow overflow-y-auto p-6 space-y-6 bg-background">
          {messages.map((msg) => {
            const isStudent = msg.sender === 'student'
            return (
              <div
                key={msg.id}
                className={`flex gap-4 ${isStudent ? 'justify-end' : 'justify-start'}`}
              >
                {/* Tutor icon placeholder */}
                {!isStudent && (
                  <div className="h-8 w-8 rounded-[10px] bg-accent text-white flex items-center justify-center shadow-sm select-none flex-shrink-0 text-xs font-bold">
                    L
                  </div>
                )}

                {/* NOTEBOOK PAPER CARD */}
                <div
                  className={`relative max-w-2xl border border-border/80 rounded-[10px] shadow-[0_2px_6px_rgba(139,94,60,0.04)] p-5 pb-6 ${
                    isStudent
                      ? 'bg-card border-r-2 border-r-primary/40'
                      : 'bg-card border-l-2 border-l-accent/40'
                  }`}
                >
                  {/* Vertical margin rule line like notebook paper */}
                  <div
                    className={`absolute top-0 bottom-0 w-px bg-red-200 ${
                      isStudent ? 'right-12' : 'left-12'
                    } opacity-40 pointer-events-none`}
                  />

                  {/* Actions (Tutor messages only) */}
                  {!isStudent && (
                    <div className="absolute top-3 right-3 flex items-center gap-2">
                      <button
                        onClick={() => handleCopy(msg.id, msg.text)}
                        className="p-1.5 rounded-md hover:bg-accent/10 text-text/40 hover:text-accent transition-colors"
                        title="Copy note"
                        aria-label="Copy note to clipboard"
                      >
                        {copiedId === msg.id ? (
                          <Check className="w-3.5 h-3.5 text-accent" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                      <button
                        onClick={() => handleBookmark(msg.id)}
                        className="p-1.5 rounded-md hover:bg-accent/10 text-text/40 hover:text-accent transition-colors"
                        title="Bookmark note"
                        aria-label="Toggle bookmark state"
                      >
                        {bookmarkedIds.has(msg.id) ? (
                          <BookmarkCheck className="w-3.5 h-3.5 text-accent" />
                        ) : (
                          <Bookmark className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  )}

                  {/* Message content */}
                  <div className={`prose prose-sm max-w-none text-text leading-relaxed font-sans ${isStudent ? 'pr-4' : 'pl-4'}`}>
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                  </div>

                  {/* Timestamp */}
                  <span className={`absolute bottom-1 right-3 text-[9px] text-text/35 font-mono ${isStudent ? 'pr-4' : 'pl-4'}`}>
                    {msg.timestamp}
                  </span>
                </div>

                {/* Student icon placeholder */}
                {isStudent && (
                  <div className="h-8 w-8 rounded-[10px] bg-primary/10 border border-primary/20 text-primary flex items-center justify-center shadow-sm select-none flex-shrink-0 text-xs font-bold">
                    U
                  </div>
                )}
              </div>
            )
          })}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex gap-4 justify-start">
              <div className="h-8 w-8 rounded-[10px] bg-accent text-white flex items-center justify-center shadow-sm select-none flex-shrink-0 text-xs font-bold">
                L
              </div>
              <div className="relative border border-border/80 rounded-[10px] bg-card border-l-2 border-l-accent/40 px-5 py-3 shadow-[0_2px_6px_rgba(139,94,60,0.04)] flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-accent/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                <span className="w-1.5 h-1.5 bg-accent/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                <span className="w-1.5 h-1.5 bg-accent/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
              </div>
            </div>
          )}
          
          <div ref={chatEndRef} />
        </div>

        {/* Input panel */}
        <div className="p-4 border-t border-border bg-card flex flex-col gap-3">
          <div className="flex gap-3.5 items-end">
            {/* Attachment Button */}
            <Button
              onClick={() => showToast('This feature will be available after AI connection.')}
              variant="outline"
              className="p-3 h-[44px] w-[44px] flex items-center justify-center text-text/50"
              title="Attach file"
              aria-label="Attach file"
            >
              <Paperclip className="w-4 h-4" />
            </Button>

            {/* Writing Area */}
            <div className="flex-grow">
              <textarea
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSend()
                  }
                }}
                placeholder="Ask the Study Room Tutor to explain notes, verify code, or summarize articles..."
                className="w-full pl-4 pr-4 py-2.5 text-xs bg-background border border-border text-text rounded-[10px] focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/25 placeholder:text-text/40 font-sans min-h-[44px] max-h-[120px] resize-y"
              />
            </div>

            {/* Send Button */}
            <Button
              onClick={handleSend}
              variant="primary"
              className="p-3 h-[44px] w-[44px] flex items-center justify-center"
              aria-label="Send query"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>

      </div>

    </div>
  )
}

export default AITutor
