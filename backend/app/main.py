"""
Application entry point.

Creates the FastAPI app, configures CORS, registers all routers,
and defines global exception handlers so every error response
(400/404/422/429/500) has a consistent JSON shape.
"""
from app.utils.database import Base, engine
from app.models.user_model import User
from fastapi import FastAPI, HTTPException, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.routers import dashboard
from app.config import settings
from app.models.chat_model import ChatMessage
from app.models.response_models import ErrorResponse
from app.routers import (
    assignment,
    chat,
    flashcards,
    planner,
    quiz,
    summarize,
    auth,
)
from app.utils.logger import get_logger

logger = get_logger(__name__)

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="StudentHub AI",
    description="AI-powered study companion backend.",
    version="1.0.0",
)

# ----------------------------------------------------------------------
# CORS
# ----------------------------------------------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_origin],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ----------------------------------------------------------------------
# Routers
# ----------------------------------------------------------------------

app.include_router(chat.router)
app.include_router(summarize.router)
app.include_router(quiz.router)
app.include_router(planner.router)
app.include_router(assignment.router)
app.include_router(flashcards.router)
app.include_router(auth.router)
app.include_router(dashboard.router)

# ----------------------------------------------------------------------
# Global exception handlers
# ----------------------------------------------------------------------


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(
    request: Request, exc: RequestValidationError
) -> JSONResponse:
    logger.warning("Validation error on %s: %s", request.url.path, exc.errors())
    first_error = exc.errors()[0]
    field = ".".join(str(loc) for loc in first_error["loc"] if loc != "body")
    detail = f"{field}: {first_error['msg']}" if field else first_error["msg"]
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content=ErrorResponse(
            error="Validation failed", detail=detail
        ).model_dump(),
    )


@app.exception_handler(HTTPException)
async def http_exception_handler(
    request: Request, exc: HTTPException
) -> JSONResponse:
    logger.warning(
        "HTTPException on %s: status=%d detail=%s",
        request.url.path,
        exc.status_code,
        exc.detail,
    )
    error_messages = {
        400: "Bad request",
        404: "Resource not found",
        422: "Validation failed",
        429: "Too many requests",
        500: "Internal server error",
        502: "Bad gateway from upstream AI service",
    }
    return JSONResponse(
        status_code=exc.status_code,
        content=ErrorResponse(
            error=error_messages.get(exc.status_code, "Error"),
            detail=str(exc.detail),
        ).model_dump(),
    )


@app.exception_handler(Exception)
async def unhandled_exception_handler(
    request: Request, exc: Exception
) -> JSONResponse:
    logger.error("Unhandled exception on %s: %s", request.url.path, exc)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content=ErrorResponse(
            error="Internal server error",
            detail="An unexpected error occurred. Please try again later.",
        ).model_dump(),
    )


# ----------------------------------------------------------------------
# Health check (useful for AWS App Runner health checks)
# ----------------------------------------------------------------------


@app.get("/health", tags=["Health"])
async def health_check() -> dict[str, str]:
    return {"status": "ok", "environment": settings.app_env}
