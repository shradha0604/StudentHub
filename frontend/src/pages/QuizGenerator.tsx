import React, { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Loading } from '../components/ui/Loading'
import { EmptyState } from '../components/ui/EmptyState'
import { useToast } from '../components/ui/Toast'
import { generateQuiz, getApiErrorMessage } from '../services/api'
import {
  ClipboardCheck,
  CheckCircle,
  Award,
  RefreshCw
} from 'lucide-react'

interface Question {
  id: string
  text: string
  options: string[]
  correctIndex: number
  explanation: string
}

const QuizGenerator: React.FC = () => {
  const { showToast } = useToast()
  const [topic, setTopic] = useState('Operating Systems - Scheduling')
  const [difficulty, setDifficulty] = useState('medium')
  const [isGenerating, setIsGenerating] = useState(false)

  const [questions, setQuestions] = useState<Question[]>([])

  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({})
  const [revealedIds, setRevealedIds] = useState<Set<string>>(new Set())

  const handleOptionSelect = (qId: string, optIdx: number) => {
    if (revealedIds.has(qId)) return // lock changes once answer is revealed
    setUserAnswers(prev => ({ ...prev, [qId]: optIdx }))
  }

  const handleReveal = (qId: string) => {
    setRevealedIds(prev => {
      const next = new Set(prev)
      if (next.has(qId)) {
        next.delete(qId)
      } else {
        next.add(qId)
      }
      return next
    })
  }

  const handleGenerate = async () => {
    if (!topic.trim()) return

    setIsGenerating(true)

    // Reset answers/revealed states
    setUserAnswers({})
    setRevealedIds(new Set())

    try {
      const data = await generateQuiz(topic, difficulty)
      setQuestions(
        data.questions.map((q, idx) => ({
          id: `${Date.now()}-${idx}`,
          text: q.question,
          options: q.options,
          correctIndex: q.options.indexOf(q.answer),
          explanation: q.explanation
        }))
      )
    } catch (error) {
      showToast(getApiErrorMessage(error))
    } finally {
      setIsGenerating(false)
    }
  }

  // Statistics calculation
  const totalQuestions = questions.length
  const answeredCount = Object.keys(userAnswers).length
  const correctCount = questions.reduce((acc, q) => {
    if (userAnswers[q.id] === q.correctIndex) {
      return acc + 1
    }
    return acc
  }, 0)

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-serif text-text mb-1">Library Examination Hall</h1>
        <p className="text-sm text-text/60 font-sans">
          Test your comprehension on syllabus topics. Answers are locked until you trigger the review stamps.
        </p>
      </div>

      {/* TOP: Practice Paper Configuration */}
      <div className="bg-card border border-border rounded-[10px] p-5 shadow-[0_2px_6px_rgba(139,94,60,0.04)]">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          
          {/* Topic Input */}
          <div className="md:col-span-2 space-y-1.5">
            <label className="text-[10px] font-bold text-text/50 uppercase tracking-wider font-sans">
              Exam Topic
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Operating Systems - Paging"
              className="w-full px-3.5 py-2 text-xs bg-background border border-border text-text rounded-[10px] focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/25 font-sans"
            />
          </div>

          {/* Difficulty Dropdown */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-text/50 uppercase tracking-wider font-sans">
              Difficulty
            </label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full px-3.5 py-2 text-xs bg-background border border-border text-text rounded-[10px] focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/25 font-sans cursor-pointer"
            >
              <option value="easy">Easy (Fundamentals)</option>
              <option value="medium">Medium (Comprehension)</option>
              <option value="hard">Hard (Analytical)</option>
            </select>
          </div>

          {/* Action Trigger */}
          <div>
            <Button
              onClick={handleGenerate}
              variant="primary"
              className="w-full h-[38px] text-xs font-semibold flex items-center justify-center gap-1.5"
              disabled={isGenerating || !topic.trim()}
              aria-label="Generate new exam paper"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Preparing Exam...
                </>
              ) : (
                <>
                  <ClipboardCheck className="w-3.5 h-3.5" /> Generate Exam Paper
                </>
              )}
            </Button>
          </div>

        </div>
      </div>

      {/* MID: Score Summary & Progress Bar */}
      {totalQuestions > 0 && (
        <div className="bg-card border border-border rounded-[10px] p-5 shadow-[0_2px_6px_rgba(139,94,60,0.04)] flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1 flex-grow">
            <div className="flex items-center justify-between text-xs text-text/60 font-sans mb-1.5">
              <span className="font-semibold text-text">Exam Progress: {answeredCount} of {totalQuestions} answered</span>
              <span className="font-semibold text-accent">{correctCount} Correct / {totalQuestions} Total</span>
            </div>
            <div className="w-full bg-background rounded-full h-2 border border-border/60">
              <div
                className="bg-accent h-2 rounded-full transition-all duration-300"
                style={{ width: `${(answeredCount / totalQuestions) * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="h-px md:h-10 w-full md:w-px bg-border/60" />

          <div className="flex items-center gap-3 md:pl-4">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-text">Completion Rating</p>
              <p className="text-[10px] text-text/50">
                {answeredCount === totalQuestions ? 'Exam finished. Review explanations.' : 'Solve all tasks to evaluate.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* BOTTOM: Examination Cards */}
      <div className="space-y-6">
        {isGenerating ? (
          <Loading message="Searching the library & compiling exam paper..." />
        ) : questions.length > 0 ? (
          questions.map((q, qIdx) => {
            const hasAnswered = userAnswers[q.id] !== undefined
            const isRevealed = revealedIds.has(q.id)
            const selectedOpt = userAnswers[q.id]

            return (
              <Card key={q.id} className="relative overflow-hidden">
                {/* Visual margin accent */}
                <div className="absolute top-0 bottom-0 left-0 w-1.5 bg-[#C8A97E] opacity-70" />

                <CardHeader className="pl-6 border-b border-border/40 pb-3">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[9px] font-bold text-text/40 tracking-wider uppercase font-mono">
                      Question {qIdx + 1}
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-border" />
                    <span className="text-[9px] font-semibold text-primary font-sans capitalize">{difficulty} Level</span>
                  </div>
                  <CardTitle className="text-base font-serif leading-relaxed text-text">
                    {q.text}
                  </CardTitle>
                </CardHeader>

                <CardContent className="pl-6 py-5 space-y-4 font-sans">
                  {/* Options List */}
                  <div className="grid grid-cols-1 gap-2.5">
                    {q.options.map((opt, oIdx) => {
                      const isSelected = selectedOpt === oIdx
                      const isCorrect = oIdx === q.correctIndex
                      
                      let optStyle = 'border-border bg-background/25 hover:bg-secondary/10'
                      
                      if (isSelected) {
                        optStyle = 'border-primary/50 bg-secondary/15 text-primary font-semibold'
                      }
                      
                      if (isRevealed) {
                        if (isCorrect) {
                          optStyle = 'border-accent bg-accent/10 text-accent font-semibold'
                        } else if (isSelected) {
                          optStyle = 'border-red-300 bg-red-50 text-red-700 font-semibold'
                        } else {
                          optStyle = 'border-border bg-background/25 opacity-60'
                        }
                      }

                      return (
                        <button
                          key={oIdx}
                          onClick={() => handleOptionSelect(q.id, oIdx)}
                          className={`w-full text-left p-3.5 rounded-[10px] border text-xs leading-normal flex items-start gap-3 transition-all duration-150 ${optStyle}`}
                          disabled={isRevealed}
                          aria-label={`Select Option ${String.fromCharCode(65 + oIdx)}`}
                        >
                          <span className="h-5 w-5 rounded-full bg-white border border-border/80 text-[10px] font-bold flex items-center justify-center text-text/50 flex-shrink-0">
                            {String.fromCharCode(65 + oIdx)}
                          </span>
                          <span>{opt}</span>
                        </button>
                      )
                    })}
                  </div>

                  {/* Actions Bar */}
                  <div className="flex items-center justify-between border-t border-border/40 pt-4 mt-2">
                    <span className="text-[10px] text-text/45 font-sans">
                      {hasAnswered ? 'Choice recorded' : 'Please select an option'}
                    </span>
                    
                    <Button
                      onClick={() => handleReveal(q.id)}
                      variant={isRevealed ? 'outline' : 'accent'}
                      size="sm"
                      className="text-xs h-8 px-4"
                      disabled={!hasAnswered}
                      aria-label={isRevealed ? 'Hide correct answer verification' : 'Reveal correct answer verification'}
                    >
                      {isRevealed ? 'Hide Stamp' : 'Reveal Answer'}
                    </Button>
                  </div>

                  {/* Explanation Area */}
                  {isRevealed && (
                    <div className="p-4 bg-background/40 border border-border/80 rounded-[10px] mt-4 space-y-2 animate-fade-in">
                      <div className="flex items-center gap-2 text-[10px] font-bold text-accent uppercase tracking-wider font-sans">
                        <CheckCircle className="w-3.5 h-3.5 text-accent" /> Academic Verification
                      </div>
                      <p className="text-xs text-text/80 leading-relaxed font-sans">
                        {q.explanation}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })
        ) : (
          <EmptyState
            title="No quizzes generated yet."
            description="Provide a syllabus topic in the input above and click Generate Exam Paper to start a mock practice session."
          />
        )}
      </div>
    </div>
  )
}

export default QuizGenerator
