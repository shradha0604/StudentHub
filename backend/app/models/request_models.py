"""
Pydantic request models for all endpoints.

These models validate incoming payloads: required fields, non-empty
strings, correct date formats, and positive integers. FastAPI
automatically returns 422 responses when validation fails.
"""

from datetime import date, datetime

from pydantic import BaseModel, Field, field_validator

from app.config import settings

from datetime import date


class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=4000)

    @field_validator("message")
    @classmethod
    def message_not_blank(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("message cannot be empty or whitespace only")
        return v.strip()


class SummarizeRequest(BaseModel):
    notes: str = Field(..., min_length=1)

    @field_validator("notes")
    @classmethod
    def notes_not_blank(cls, v: str) -> str:
        stripped = v.strip()
        if not stripped:
            raise ValueError("notes cannot be empty or whitespace only")
        if len(stripped) > settings.max_notes_length:
            raise ValueError(
                f"notes exceeds maximum length of {settings.max_notes_length} characters"
            )
        return stripped


class QuizRequest(BaseModel):
    topic: str = Field(..., min_length=1, max_length=200)
    difficulty: str = Field(..., min_length=1, max_length=50)

    @field_validator("topic")
    @classmethod
    def topic_not_blank(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("topic cannot be empty or whitespace only")
        return v.strip()

    @field_validator("difficulty")
    @classmethod
    def difficulty_valid(cls, v: str) -> str:
        stripped = v.strip()
        allowed = {"easy", "medium", "hard"}
        if stripped.lower() not in allowed:
            raise ValueError(
                f"difficulty must be one of {sorted(allowed)} (case-insensitive)"
            )
        return stripped.capitalize()


class PlannerRequest(BaseModel):
    subject: str = Field(..., min_length=1, max_length=200)
    exam_date: str = Field(..., min_length=1)
    hours_per_day: int = Field(..., gt=0, le=24)

    @field_validator("subject")
    @classmethod
    def subject_not_blank(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("subject cannot be empty or whitespace only")
        return v.strip()

    @field_validator("exam_date")
    @classmethod
    def exam_date_valid(cls, v: str) -> str:
        try:
            parsed = datetime.strptime(v.strip(), "%Y-%m-%d").date()
        except ValueError:
            raise ValueError("exam_date must be in YYYY-MM-DD format")

        if parsed <= date.today():
            raise ValueError("exam_date must be a future date")

        return v.strip()


class AssignmentRequest(BaseModel):
    topic: str = Field(..., min_length=1, max_length=200)
    word_limit: int = Field(..., gt=0, le=5000)

    @field_validator("topic")
    @classmethod
    def topic_not_blank(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("topic cannot be empty or whitespace only")
        return v.strip()


class FlashcardsRequest(BaseModel):
    topic: str = Field(..., min_length=1, max_length=200)

    @field_validator("topic")
    @classmethod
    def topic_not_blank(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("topic cannot be empty or whitespace only")
        return v.strip()


from pydantic import BaseModel, EmailStr


class SignUpRequest(BaseModel):
    full_name: str
    email: EmailStr
    password: str

    date_of_birth: date

    college_name: str
    course: str
    year_of_study: str


class LoginRequest(BaseModel):
    email: EmailStr
    password: str