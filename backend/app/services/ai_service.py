"""
AI Service.

Centralizes all interaction with the LLM provider (currently Gemini).
Routers must NEVER call the google-generativeai SDK directly -- they
should only call methods on `ai_service` (the singleton instance at
the bottom of this file).

To swap providers later, only this file needs to change: replace the
client construction and the `_complete` / `_complete_stream`
internals, keeping method signatures identical.
"""

import json
from collections.abc import AsyncGenerator
from typing import Any

from click import prompt

import google.generativeai as genai
from fastapi import HTTPException
from google.api_core import exceptions as google_exceptions

from app.config import settings
from app.utils.logger import get_logger
from app.utils.prompts import (
    assignment_prompt,
    chat_prompt,
    flashcards_prompt,
    planner_prompt,
    quiz_prompt,
    summary_prompt,
)

logger = get_logger(__name__)


class AIService:
    """
    Reusable AI service exposing one method per feature.
    Handles client construction, error translation, and JSON parsing
    in a single place so routers stay thin.
    """

    def __init__(self) -> None:
        genai.configure(api_key=settings.gemini_api_key)
        self._model_name = settings.model
        self._client = genai.GenerativeModel(self._model_name)

    # ------------------------------------------------------------------
    # Internal helpers
    # ------------------------------------------------------------------

    async def _complete(
        self, prompt: str, temperature: float = 0.7
    ) -> str:
        """
        Sends a single prompt to the LLM and returns the raw text content.
        Translates provider errors into appropriate HTTPExceptions.
        """
        try:
            response = await self._client.generate_content_async(
                prompt,
                generation_config=genai.types.GenerationConfig(
                    temperature=temperature
            ),
            request_options={"timeout": settings.request_timeout_seconds},
)
            content = response.text if response.candidates else None
            if content is None:
                raise ValueError("Empty response content from LLM")
            return content

        except (google_exceptions.Unauthenticated, google_exceptions.PermissionDenied) as exc:
            logger.error("LLM authentication failed: %s", exc)
            raise HTTPException(
                status_code=500, detail="AI service is misconfigured."
            ) from exc
        except google_exceptions.ResourceExhausted as exc:
            logger.error("LLM rate limit exceeded: %s", exc)
            raise HTTPException(
                status_code=429,
                detail="AI service is currently rate-limited. Please try again shortly.",
            ) from exc
        except (
            google_exceptions.ServiceUnavailable,
            google_exceptions.DeadlineExceeded,
        ) as exc:
            logger.error("LLM connection error: %s", exc)
            raise HTTPException(
                status_code=500, detail="Could not reach the AI service."
            ) from exc
        except google_exceptions.GoogleAPIError as exc:
            logger.error("LLM API error: %s", exc)
            raise HTTPException(
                status_code=500, detail="The AI service returned an error."
            ) from exc
        except Exception as exc:
            import traceback
            traceback.print_exc()
            logger.error("Unexpected error in LLM completion: %s", exc)
            raise

    async def _complete_stream(
        self, prompt: str, temperature: float = 0.7
    ) -> AsyncGenerator[str, None]:
        """
        Sends a prompt to the LLM and yields text chunks as they arrive.
        Used for SSE streaming on the /chat endpoint.
        """
        try:
            stream = await self._client.generate_content_async(
                prompt,
                generation_config=genai.types.GenerationConfig(
                    temperature=temperature
                ),
                request_options={"timeout": settings.request_timeout_seconds},
                stream=True,
            )
            async for chunk in stream:
                if chunk.text:
                    yield chunk.text

        except (google_exceptions.Unauthenticated, google_exceptions.PermissionDenied) as exc:
            logger.error("LLM authentication failed during stream: %s", exc)
            raise HTTPException(
                status_code=500, detail="AI service is misconfigured."
            ) from exc
        except google_exceptions.ResourceExhausted as exc:
            logger.error("LLM rate limit exceeded during stream: %s", exc)
            raise HTTPException(
                status_code=429,
                detail="AI service is currently rate-limited. Please try again shortly.",
            ) from exc
        except google_exceptions.GoogleAPIError as exc:
            logger.error("LLM API error during stream: %s", exc)
            raise HTTPException(
                status_code=500, detail="The AI service returned an error."
            ) from exc

    @staticmethod
    def _parse_json_response(raw: str) -> dict[str, Any]:
        """
        Safely parses JSON content returned by the LLM, stripping
        accidental markdown code fences if present.
        """
        cleaned = raw.strip()
        if cleaned.startswith("```"):
            cleaned = cleaned.strip("`")
            if cleaned.lower().startswith("json"):
                cleaned = cleaned[4:]
            cleaned = cleaned.strip()

        try:
            return json.loads(cleaned)
        except json.JSONDecodeError as exc:
            logger.error("Failed to parse LLM JSON response: %s | raw=%s", exc, raw)
            raise HTTPException(
                status_code=502,
                detail="AI service returned an unparseable response. Please try again.",
            ) from exc

    # ------------------------------------------------------------------
    # Public methods -- one per feature
    # ------------------------------------------------------------------

    async def generate_chat(
        self,
        message: str,
        history=None,
    ) -> str:
        conversation = ""

        if history:
            for msg in history:
                if msg.role == "user":
                    conversation += f"User: {msg.message}\n"
                else:
                    conversation += f"Assistant: {msg.message}\n"

        prompt = f"""
        You are StudentHub AI Tutor.

        Continue the conversation naturally.

        Previous Conversation:
        {conversation}

        Current User Message:
        {message}

        Answer naturally while remembering the previous discussion.
        """

        return await self._complete(prompt)

    async def generate_chat_stream(
        self, message: str
    ) -> AsyncGenerator[str, None]:
        prompt = chat_prompt(message)
        async for chunk in self._complete_stream(prompt):
            yield chunk

    async def generate_summary(self, notes: str) -> dict[str, Any]:
        prompt = summary_prompt(notes)
        raw = await self._complete(prompt, temperature=0.4)
        return self._parse_json_response(raw)

    async def generate_quiz(self, topic: str, difficulty: str) -> dict[str, Any]:
        prompt = quiz_prompt(topic, difficulty)
        raw = await self._complete(prompt, temperature=0.6)
        return self._parse_json_response(raw)

    async def generate_planner(
        self, subject: str, exam_date: str, hours_per_day: int
    ) -> dict[str, Any]:
        prompt = planner_prompt(subject, exam_date, hours_per_day)
        raw = await self._complete(prompt, temperature=0.5)
        return self._parse_json_response(raw)

    async def generate_assignment(
        self, topic: str, word_limit: int
    ) -> dict[str, Any]:
        prompt = assignment_prompt(topic, word_limit)
        raw = await self._complete(prompt, temperature=0.7)
        return self._parse_json_response(raw)

    async def generate_flashcards(self, topic: str) -> dict[str, Any]:
        prompt = flashcards_prompt(topic)
        raw = await self._complete(prompt, temperature=0.6)
        return self._parse_json_response(raw)


# Singleton instance -- routers import this directly.
ai_service = AIService()