"""
Pydantic response models for all endpoints.

These models define the exact JSON shape returned to clients.
ai_service.py parses raw LLM output into dicts, which routers then
validate/serialize through these models before returning.
"""

from pydantic import BaseModel


class ChatResponse(BaseModel):
    reply: str


class SummarizeResponse(BaseModel):
    summary: str
    key_points: list[str]
    keywords: list[str]
    revision_notes: str


class QuizQuestion(BaseModel):
    question: str
    options: list[str]
    answer: str
    explanation: str


class QuizResponse(BaseModel):
    questions: list[QuizQuestion]


class PlannerDay(BaseModel):
    date: str
    topics: list[str]
    tasks: str


class PlannerResponse(BaseModel):
    daily_plan: list[PlannerDay]


class AssignmentResponse(BaseModel):
    assignment: str


class Flashcard(BaseModel):
    question: str
    answer: str


class FlashcardsResponse(BaseModel):
    flashcards: list[Flashcard]


class ErrorResponse(BaseModel):
    error: str
    detail: str | None = None
