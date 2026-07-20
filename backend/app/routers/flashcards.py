"""
Flashcards router -- Flashcards Generator feature.

POST /flashcards
"""

from fastapi import APIRouter

from app.models.request_models import FlashcardsRequest
from app.models.response_models import FlashcardsResponse
from app.services.ai_service import ai_service
from app.utils.logger import get_logger

logger = get_logger(__name__)

router = APIRouter(tags=["Flashcards"])


@router.post("/flashcards", response_model=FlashcardsResponse)
async def flashcards(payload: FlashcardsRequest) -> FlashcardsResponse:
    logger.info("POST /flashcards | topic=%s", payload.topic)

    result = await ai_service.generate_flashcards(payload.topic)
    return FlashcardsResponse(**result)
