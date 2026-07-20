import React, { useState } from 'react'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import ReactMarkdown from 'react-markdown'
import { Loading } from '../components/ui/Loading'
import { EmptyState } from '../components/ui/EmptyState'
import { useSearch } from '../context/SearchContext'
import { useToast } from '../components/ui/Toast'
import { generateAssignment, getApiErrorMessage } from '../services/api'
import {
  Sparkles,
  RefreshCw,
  Copy,
  Download,
  Check,
  GraduationCap
} from 'lucide-react'

interface AssignmentConfig {
  subject: string
  topic: string
  wordLimit: number
  tone: string
}

const AssignmentHelper: React.FC = () => {
  const { searchQuery } = useSearch()
  const { showToast } = useToast()
  const [config, setConfig] = useState<AssignmentConfig>({
    subject: 'Operating Systems',
    topic: 'Mutual Exclusion and Semaphores in Multi-threaded Kernels',
    wordLimit: 500,
    tone: 'Academic'
  })

  const [isGenerating, setIsGenerating] = useState(false)
  const [copied, setCopied] = useState(false)
  const [draft, setDraft] = useState<string>('')

  const handleGenerate = async () => {
    if (!config.topic.trim()) return

    setIsGenerating(true)

    try {
      // The backend's /assignment endpoint only accepts `topic` and
      // `word_limit`; the subject and tone chosen in this panel are kept as
      // local context in the generated topic string since the backend has
      // no dedicated fields for them.
      const composedTopic = `${config.subject}: ${config.topic} (${config.tone} tone)`
      const data = await generateAssignment(composedTopic, config.wordLimit)
      setDraft(data.assignment)
    } catch (error) {
      showToast(getApiErrorMessage(error))
    } finally {
      setIsGenerating(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(draft)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    const blob = new Blob([draft], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${config.topic.toLowerCase().replace(/\s+/g, '_')}_helper.md`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-serif text-text mb-1">Assignment Helper</h1>
        <p className="text-sm text-text/60 font-sans">
          Provide your assignment criteria to generate a structured reference manuscript on premium academic paper.
        </p>
      </div>

      {/* Grid: Details Config on Left, Paper Preview on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-14rem)] min-h-[550px] max-h-[750px]">
        
        {/* LEFT COLUMN: Assignment Specifications */}
        <Card className="lg:col-span-1 p-5 flex flex-col justify-between overflow-y-auto">
          <div className="space-y-5">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
                  <GraduationCap className="w-4.5 h-4.5" />
                </div>
                <h3 className="font-serif font-bold text-sm text-text">Writing Console</h3>
              </div>
              <p className="text-[10px] text-text/50 font-sans leading-relaxed">
                Draft reference outlines or review essay structures. Content is compiled matching academic format rules.
              </p>
            </div>

            <div className="h-px bg-border/60" />

            {/* Inputs */}
            <div className="space-y-4 font-sans text-xs">
              
              {/* Subject */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-text/50 uppercase tracking-wider">Subject Area</label>
                <select
                  value={config.subject}
                  onChange={(e) => setConfig({ ...config, subject: e.target.value })}
                  className="w-full px-3.5 py-2 bg-background border border-border text-text rounded-[10px] focus:outline-none focus:border-primary/60 font-sans cursor-pointer"
                >
                  <option value="Operating Systems">Operating Systems</option>
                  <option value="DBMS">Database Systems (DBMS)</option>
                  <option value="Computer Networks">Computer Networks</option>
                  <option value="Cloud Computing">Cloud Computing</option>
                  <option value="Data Structures">Data Structures & Algorithms</option>
                </select>
              </div>

              {/* Topic */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-text/50 uppercase tracking-wider">Assignment Topic</label>
                <textarea
                  value={config.topic}
                  onChange={(e) => setConfig({ ...config, topic: e.target.value })}
                  placeholder="e.g. B-Tree structure and splitting"
                  className="w-full px-3.5 py-2 bg-background border border-border text-text rounded-[10px] focus:outline-none focus:border-primary/60 font-sans min-h-[60px] resize-none"
                />
              </div>

              {/* Word Limit */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-text/50 uppercase tracking-wider">Word Limit Target</label>
                <select
                  value={config.wordLimit}
                  onChange={(e) => setConfig({ ...config, wordLimit: Number(e.target.value) })}
                  className="w-full px-3.5 py-2 bg-background border border-border text-text rounded-[10px] focus:outline-none focus:border-primary/60 font-sans cursor-pointer"
                >
                  <option value={250}>250 Words (Brief Overview)</option>
                  <option value={500}>500 Words (Standard Essay)</option>
                  <option value={750}>750 Words (Detailed Analysis)</option>
                  <option value={1000}>1000 Words (Full Report)</option>
                </select>
              </div>

              {/* Tone */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-text/50 uppercase tracking-wider">Academic Tone</label>
                <select
                  value={config.tone}
                  onChange={(e) => setConfig({ ...config, tone: e.target.value })}
                  className="w-full px-3.5 py-2 bg-background border border-border text-text rounded-[10px] focus:outline-none focus:border-primary/60 font-sans cursor-pointer"
                >
                  <option value="Academic">Formal Academic</option>
                  <option value="Technical">Technical & Structured</option>
                  <option value="Analytical">Analytical Review</option>
                  <option value="Explanatory">Explanatory (Tutorial-style)</option>
                </select>
              </div>

            </div>
          </div>

          <div>
            <Button
              onClick={handleGenerate}
              variant="primary"
              className="w-full h-[38px] text-xs font-semibold flex items-center justify-center gap-1.5"
              disabled={isGenerating || !config.topic.trim()}
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Drafting Manuscript...
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" /> Compile Reference Paper
                </>
              )}
            </Button>
          </div>
        </Card>

        {/* RIGHT COLUMN: Premium Academic Paper Preview */}
        <Card className="lg:col-span-2 flex flex-col justify-between bg-card overflow-hidden h-full">
          
          {/* Paper Header Controls */}
          <div className="p-4 border-b border-border/60 bg-card flex items-center justify-between z-10 px-6">
            <span className="text-[10px] font-bold text-text/45 tracking-wider uppercase font-mono">
              Academic Paper Preview
            </span>
            <div className="flex items-center gap-2">
              <Button
                onClick={handleCopy}
                variant="outline"
                size="sm"
                className="h-8 py-1 px-3 text-[11px]"
                title="Copy note"
                aria-label="Copy text to clipboard"
              >
                {copied ? (
                  <Check className="w-3.5 h-3.5 text-accent mr-1" />
                ) : (
                  <Copy className="w-3.5 h-3.5 mr-1" />
                )}
                Copy Text
              </Button>
              <Button
                onClick={handleDownload}
                variant="outline"
                size="sm"
                className="h-8 py-1 px-3 text-[11px]"
                title="Export PDF simulation"
                aria-label="Export Markdown file"
              >
                <Download className="w-3.5 h-3.5 mr-1" /> Export MD
              </Button>
              <Button
                onClick={handleGenerate}
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 flex items-center justify-center border border-border"
                title="Regenerate assignment"
                aria-label="Regenerate draft"
              >
                <RefreshCw className="w-3.5 h-3.5 text-text/50" />
              </Button>
            </div>
          </div>

          {/* Paper Content body */}
          <div className="flex-grow overflow-y-auto p-8 md:p-12 bg-background relative flex justify-center">
            
            {/* Lined watermark / margin details on paper */}
            <div className="absolute top-0 bottom-0 left-8 w-[1px] bg-red-100 pointer-events-none" />
            <div className="absolute top-0 bottom-0 left-[34px] w-[1px] bg-red-100 pointer-events-none opacity-40" />

            {/* Main Sheet Container */}
            <div className="w-full max-w-2xl pl-6 relative">
              {isGenerating ? (
                <div className="py-12">
                  <Loading message="Applying citation index guidelines & drafting manuscript..." />
                </div>
              ) : draft ? (
                searchQuery && !config.topic.toLowerCase().includes(searchQuery.toLowerCase()) && !draft.toLowerCase().includes(searchQuery.toLowerCase()) ? (
                  <EmptyState
                    title="No matching assignments found."
                    description={`No topics in the active manuscript match your search for "${searchQuery}".`}
                  />
                ) : (
                  <div className="prose prose-sm max-w-none font-serif text-text leading-[26px]">
                    <ReactMarkdown>{draft}</ReactMarkdown>
                  </div>
                )
              ) : (
                <EmptyState
                  title="Start writing your next assignment."
                  description="Provide a subject and topic in the settings panel to generate a customized reference assignment manuscript."
                />
              )}
            </div>

          </div>

        </Card>

      </div>
    </div>
  )
}

export default AssignmentHelper
