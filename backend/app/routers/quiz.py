"""
Quiz router -- Quiz Generator feature.

POST /quiz
"""

from fastapi import APIRouter

from app.models.request_models import QuizRequest
from app.models.response_models import QuizResponse
from app.services.ai_service import ai_service
from app.utils.logger import get_logger

logger = get_logger(__name__)

router = APIRouter(tags=["Quiz"])


@router.post("/quiz", response_model=QuizResponse)
async def quiz(payload: QuizRequest) -> QuizResponse:
    logger.info(
        "POST /quiz | topic=%s | difficulty=%s", payload.topic, payload.difficulty
    )

    result = await ai_service.generate_quiz(payload.topic, payload.difficulty)
    return QuizResponse(**result)
