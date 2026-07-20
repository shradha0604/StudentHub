import React, { useState } from 'react'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Loading } from '../components/ui/Loading'
import { EmptyState } from '../components/ui/EmptyState'
import { useToast } from '../components/ui/Toast'
import { summarizeNotes, getApiErrorMessage } from '../services/api'
import {
  Sparkles,
  RotateCcw,
  Copy,
  Download,
  Check,
  BookOpen,
  Pin,
  TrendingUp,
  Highlighter,
  ChevronRight
} from 'lucide-react'

interface SummaryResult {
  summary: string
  keyPoints: string[]
  terms: { term: string; definition: string }[]
  revisionNotes: string[]
}

const NotesSummarizer: React.FC = () => {
  const { showToast } = useToast()
  const [editorText, setEditorText] = useState<string>(
    `Operating Systems Notes - Page 14\n\nVirtual memory is a storage allocation scheme in which secondary memory can be addressed as though it were part of main memory. The addresses a program references are distinguished from the addresses the memory system uses to identify physical storage sites, and program-generated addresses are translated automatically into the corresponding machine addresses.\n\nPaging is the most common implementation. Memory is divided into fixed-size blocks called pages (on virtual memory side) and frames (on physical memory side). When a page fault occurs, it means the required page is not in RAM, triggering a kernel trap. The OS then fetches the page from swap space on disk and loads it into a physical frame, updating the page table entry.`
  )
  
  const [isSummarizing, setIsSummarizing] = useState(false)
  const [copied, setCopied] = useState(false)
  const [result, setResult] = useState<SummaryResult | null>(null)

  const handleClear = () => {
    setEditorText('')
    setResult(null)
  }

  const handleSummarize = async () => {
    if (!editorText.trim()) return

    setIsSummarizing(true)

    try {
      const data = await summarizeNotes(editorText)
      setResult({
        summary: data.summary,
        keyPoints: data.key_points,
        terms: data.keywords.map((keyword) => ({ term: keyword, definition: '' })),
        revisionNotes: data.revision_notes
          .split('\n')
          .map((line) => line.trim())
          .filter((line) => line.length > 0)
      })
    } catch (error) {
      showToast(getApiErrorMessage(error))
    } finally {
      setIsSummarizing(false)
    }
  }

  const handleCopy = () => {
    if (!result) return
    const text = `SUMMARY:\n${result.summary}\n\nKEY POINTS:\n${result.keyPoints.map(k => `- ${k}`).join('\n')}\n\nTERMS:\n${result.terms.map(t => `- ${t.term}: ${t.definition}`).join('\n')}`
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    if (!result) return
    const markdown = `# Study Notes Summary\n\n## Brief Summary\n${result.summary}\n\n## Key Points\n${result.keyPoints.map(k => `* ${k}`).join('\n')}\n\n## Important Terms\n${result.terms.map(t => `* **${t.term}**: ${t.definition}`).join('\n')}\n\n## Revision Checklist\n${result.revisionNotes.map(r => `- [ ] ${r}`).join('\n')}`
    
    const blob = new Blob([markdown], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'study_summary.md'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-serif text-text mb-1">Notes Summarizer</h1>
        <p className="text-sm text-text/60 font-sans">
          Draft your notes or paste text from references inside the notebook, and let the assistant index revisions.
        </p>
      </div>

      {/* Grid Layout: Notebook Editor vs Summary Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-14rem)] min-h-[550px] max-h-[750px]">
        
        {/* LEFT COLUMN: Ruled Notebook Paper Editor */}
        <div className="flex flex-col border border-border bg-card rounded-[10px] shadow-[0_4px_12px_rgba(139,94,60,0.04)] overflow-hidden relative h-full">
          {/* Notebook Spiral Binding Mock on Left Edge */}
          <div className="absolute left-0 top-0 bottom-0 w-3 bg-secondary/10 flex flex-col justify-around py-4 border-r border-border/50 z-10 pointer-events-none">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="h-1.5 w-4 bg-[#8B5E3C]/20 border border-[#8B5E3C]/35 rounded-full -ml-0.5 shadow-xs" />
            ))}
          </div>

          {/* Notebook Paper Body */}
          <div className="flex-grow relative pl-8 pr-6 py-6 flex flex-col h-full">
            {/* Lined Margins Rules */}
            <div className="absolute top-0 bottom-0 left-12 w-[1.5px] bg-red-200/60 pointer-events-none" />

            {/* Ruled Notebook Paper Textarea */}
            <textarea
              value={editorText}
              onChange={(e) => setEditorText(e.target.value)}
              placeholder="Start drafting or paste academic text here..."
              className="w-full flex-grow text-sm text-text/90 font-serif leading-[28px] focus:outline-none bg-transparent resize-none h-full pl-6 pr-2 pt-1.5"
              style={{
                backgroundImage: 'linear-gradient(transparent, transparent 27px, #EBE5DB 27px, #EBE5DB 28px)',
                backgroundSize: '100% 28px',
                lineHeight: '28px',
              }}
            />
          </div>

          {/* Action Bar Bottom */}
          <div className="p-4 border-t border-border bg-card flex items-center justify-between z-10 pl-8">
            <Button
              onClick={handleClear}
              variant="outline"
              size="sm"
              className="flex items-center gap-1.5 text-xs"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Clear Notebook
            </Button>
            <Button
              onClick={handleSummarize}
              variant="accent"
              size="sm"
              className="flex items-center gap-1.5 text-xs font-semibold"
              disabled={isSummarizing || !editorText.trim()}
            >
              <Sparkles className="w-3.5 h-3.5" /> {isSummarizing ? 'Reviewing Notes...' : 'Summarize Notes'}
            </Button>
          </div>
        </div>

        {/* RIGHT COLUMN: Revision & Summary Card */}
        <div className="flex flex-col h-full">
          {isSummarizing ? (
            <Card className="flex flex-col items-center justify-center p-12 text-center border-dashed flex-grow h-full min-h-[300px]">
              <Loading message="Reading notebook & summarizing notes..." />
            </Card>
          ) : result ? (
            <Card className="flex flex-col h-full overflow-hidden">
              {/* Card Header & Controls */}
              <div className="p-5 border-b border-border/60 bg-background/30 flex items-center justify-between">
                <div>
                  <h3 className="font-serif font-bold text-base text-text">Revision Index</h3>
                  <p className="text-[10px] text-text/50 font-sans">Compiled by study assistant</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    onClick={handleCopy}
                    variant="outline"
                    size="sm"
                    className="h-8 py-1 px-3 text-[11px]"
                    title="Copy index to clipboard"
                  >
                    {copied ? (
                      <Check className="w-3 h-3 text-accent mr-1" />
                    ) : (
                      <Copy className="w-3 h-3 mr-1" />
                    )}
                    Copy
                  </Button>
                  <Button
                    onClick={handleDownload}
                    variant="outline"
                    size="sm"
                    className="h-8 py-1 px-3 text-[11px]"
                    title="Download Markdown summary"
                  >
                    <Download className="w-3 h-3 mr-1" /> Download
                  </Button>
                </div>
              </div>

              {/* Card Content (Scrollable list of details) */}
              <div className="flex-grow overflow-y-auto p-5 space-y-5">
                {/* 1. Brief Summary */}
                <div className="space-y-1.5">
                  <h4 className="text-[11px] font-bold text-primary uppercase tracking-wider font-sans flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5" /> Brief Summary
                  </h4>
                  <p className="text-xs text-text/80 leading-relaxed font-sans bg-background/30 p-3 rounded-[8px] border border-border/40">
                    {result.summary}
                  </p>
                </div>

                {/* 2. Key Points */}
                <div className="space-y-2">
                  <h4 className="text-[11px] font-bold text-accent uppercase tracking-wider font-sans flex items-center gap-1.5">
                    <Pin className="w-3.5 h-3.5" /> Key Points
                  </h4>
                  <ul className="space-y-1.5 pl-1.5">
                    {result.keyPoints.map((pt, idx) => (
                      <li key={idx} className="text-xs text-text/75 leading-relaxed flex items-start gap-2">
                        <ChevronRight className="w-3.5 h-3.5 text-primary flex-shrink-0 mt-0.5" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 3. Important Terms */}
                <div className="space-y-2">
                  <h4 className="text-[11px] font-bold text-primary uppercase tracking-wider font-sans flex items-center gap-1.5">
                    <Highlighter className="w-3.5 h-3.5" /> Important Terms
                  </h4>
                  <div className="grid grid-cols-1 gap-2.5">
                    {result.terms.map((t, idx) => (
                      <div key={idx} className="p-2.5 rounded-[8px] border border-border/50 bg-card flex flex-col gap-0.5">
                        <span className="text-xs font-bold text-accent">{t.term}</span>
                        {t.definition && (
                          <span className="text-[11px] text-text/60 leading-normal font-sans">{t.definition}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* 4. Revision Checklist */}
                <div className="space-y-2">
                  <h4 className="text-[11px] font-bold text-primary uppercase tracking-wider font-sans flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5" /> Suggested Revisions
                  </h4>
                  <div className="space-y-1.5">
                    {result.revisionNotes.map((note, idx) => (
                      <div key={idx} className="flex items-center gap-2.5 px-2 py-1.5 bg-background/20 rounded-[8px] border border-border/30">
                        <div className="w-1.5 h-1.5 bg-accent rounded-full flex-shrink-0" />
                        <span className="text-xs text-text/70 font-sans leading-normal">{note}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          ) : (
            <EmptyState
              title="Your notebook is waiting."
              description="Write notes or paste text into the notebook ruled paper editor and click Summarize Notes to generate study summaries."
            />
          )}
        </div>

      </div>
    </div>
  )
}

export default NotesSummarizer
