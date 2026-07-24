/**
 * Reusable Axios API service for the StudentHub backend.
 *
 * Every AI-powered feature in the frontend (AI Tutor, Notes Summarizer,
 * Quiz Generator, Study Planner, Assignment Helper, Flashcards) goes
 * through this single module so request/response handling, base URL,
 * and error normalization stay in one place.
 *
 * Base URL is configurable via the VITE_API_BASE_URL environment
 * variable (see .env.example) and defaults to the backend's local
 * development address.
 */

import axios, { AxiosError } from 'axios'
import type {
  ChatRequest,
  ChatResponse,
  SummarizeRequest,
  SummarizeResponse,
  QuizRequest,
  QuizResponse,
  PlannerRequest,
  PlannerResponse,
  AssignmentRequest,
  AssignmentResponse,
  FlashcardsRequest,
  FlashcardsResponse,
  ApiErrorResponse
} from '../types/api'

const API_BASE_URL: string =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? "/api"

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 60000
})

// ---------------------------------------------------------------------------
// Automatically attach JWT token to every request
// ---------------------------------------------------------------------------
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => Promise.reject(error)
)

/**
 * Normalizes any Axios error (validation errors, network errors, 5xx, etc.)
 * into a single human-readable message, matching the backend's
 * `{ error, detail }` error shape defined in ErrorResponse.
 */
export function getApiErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiErrorResponse>
    const data = axiosError.response?.data

    if (data?.detail) return data.detail
    if (data?.error) return data.error
    if (axiosError.code === 'ECONNABORTED') return 'The request timed out. Please try again.'
    if (!axiosError.response) return 'Unable to reach the server. Please check your connection.'
    return axiosError.message || 'Something went wrong. Please try again.'
  }

  return 'An unexpected error occurred. Please try again.'
}

// ---------------------------------------------------------------------------
// AI Tutor — POST /chat
// ---------------------------------------------------------------------------
export async function sendChatMessage(message: string): Promise<ChatResponse> {
  const payload: ChatRequest = { message }
  const { data } = await apiClient.post<ChatResponse>('/chat', payload)
  return data
}

// ---------------------------------------------------------------------------
// Notes Summarizer — POST /summarize
// ---------------------------------------------------------------------------
export async function summarizeNotes(notes: string): Promise<SummarizeResponse> {
  const payload: SummarizeRequest = { notes }
  const { data } = await apiClient.post<SummarizeResponse>('/summarize', payload)
  return data
}

// ---------------------------------------------------------------------------
// Quiz Generator — POST /quiz
// ---------------------------------------------------------------------------
export async function generateQuiz(topic: string, difficulty: string): Promise<QuizResponse> {
  const payload: QuizRequest = { topic, difficulty }
  const { data } = await apiClient.post<QuizResponse>('/quiz', payload)
  return data
}

// ---------------------------------------------------------------------------
// Study Planner — POST /planner
// ---------------------------------------------------------------------------
export async function generatePlanner(
  subject: string,
  examDate: string,
  hoursPerDay: number
): Promise<PlannerResponse> {
  const payload: PlannerRequest = {
    subject,
    exam_date: examDate,
    hours_per_day: hoursPerDay
  }
  const { data } = await apiClient.post<PlannerResponse>('/planner', payload)
  return data
}

// ---------------------------------------------------------------------------
// Assignment Helper — POST /assignment
// ---------------------------------------------------------------------------
export async function generateAssignment(
  topic: string,
  wordLimit: number
): Promise<AssignmentResponse> {
  const payload: AssignmentRequest = { topic, word_limit: wordLimit }
  const { data } = await apiClient.post<AssignmentResponse>('/assignment', payload)
  return data
}

// ---------------------------------------------------------------------------
// Flashcards — POST /flashcards
// ---------------------------------------------------------------------------
export async function generateFlashcards(topic: string): Promise<FlashcardsResponse> {
  const payload: FlashcardsRequest = { topic }
  const { data } = await apiClient.post<FlashcardsResponse>('/flashcards', payload)
  return data
}

// ---------------------------------------------------------------------------
// Authentication
// ---------------------------------------------------------------------------

export interface LoginResponse {
  access_token: string
  token_type: string
}

export interface SignupRequest {
  full_name: string
  email: string
  password: string
  college_name: string
  course: string
  year_of_study: string
}

export async function signup(data: SignupRequest) {
  const { data: response } = await apiClient.post(
    "/auth/signup",
    data
  )

  return response
}

export async function login(
  email: string,
  password: string
): Promise<LoginResponse> {

  const { data } = await apiClient.post<LoginResponse>(
    "/auth/login",
    {
      email,
      password,
    }
  )

  return data
}

export async function getCurrentUser() {
  const { data } = await apiClient.get("/auth/me")
  return data
}

export interface SignUpData {
  full_name: string;
  email: string;
  password: string;
  date_of_birth: string;
  college_name: string;
  course: string;
  year_of_study: string;
}

export async function signupUser(data: SignUpData) {
  const response = await apiClient.post("/auth/signup", data);
  return response.data;
}

export async function getDashboardStats() {
  const token = localStorage.getItem("token");

  const { data } = await apiClient.get("/dashboard/stats", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return data;
}