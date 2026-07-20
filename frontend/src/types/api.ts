/**
 * TypeScript types mirroring the backend's Pydantic request/response models.
 * Keep these in sync with:
 *   studenthub-backend/app/models/request_models.py
 *   studenthub-backend/app/models/response_models.py
 */

// ---------------------------------------------------------------------------
// Chat
// ---------------------------------------------------------------------------
export interface ChatRequest {
  message: string
}

export interface ChatResponse {
  reply: string
}

// ---------------------------------------------------------------------------
// Summarize
// ---------------------------------------------------------------------------
export interface SummarizeRequest {
  notes: string
}

export interface SummarizeResponse {
  summary: string
  key_points: string[]
  keywords: string[]
  revision_notes: string
}

// ---------------------------------------------------------------------------
// Quiz
// ---------------------------------------------------------------------------
export interface QuizRequest {
  topic: string
  difficulty: string
}

export interface QuizQuestion {
  question: string
  options: string[]
  answer: string
  explanation: string
}

export interface QuizResponse {
  questions: QuizQuestion[]
}

// ---------------------------------------------------------------------------
// Planner
// ---------------------------------------------------------------------------
export interface PlannerRequest {
  subject: string
  exam_date: string
  hours_per_day: number
}

export interface PlannerDay {
  date: string
  topics: string[]
  tasks: string
}

export interface PlannerResponse {
  daily_plan: PlannerDay[]
}

// ---------------------------------------------------------------------------
// Assignment
// ---------------------------------------------------------------------------
export interface AssignmentRequest {
  topic: string
  word_limit: number
}

export interface AssignmentResponse {
  assignment: string
}

// ---------------------------------------------------------------------------
// Flashcards
// ---------------------------------------------------------------------------
export interface FlashcardsRequest {
  topic: string
}

export interface FlashcardAI {
  question: string
  answer: string
}

export interface FlashcardsResponse {
  flashcards: FlashcardAI[]
}

// ---------------------------------------------------------------------------
// Errors
// ---------------------------------------------------------------------------
export interface ApiErrorResponse {
  error: string
  detail?: string | null
}
