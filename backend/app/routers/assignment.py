"""
Assignment router -- Assignment Generator feature.

POST /assignment
"""

from fastapi import APIRouter

from app.models.request_models import AssignmentRequest
from app.models.response_models import AssignmentResponse
from app.services.ai_service import ai_service
from app.utils.logger import get_logger

logger = get_logger(__name__)

router = APIRouter(tags=["Assignment"])


@router.post("/assignment", response_model=AssignmentResponse)
async def assignment(payload: AssignmentRequest) -> AssignmentResponse:
    logger.info(
        "POST /assignment | topic=%s | word_limit=%d",
        payload.topic,
        payload.word_limit,
    )

    result = await ai_service.generate_assignment(
        topic=payload.topic, word_limit=payload.word_limit
    )
    return AssignmentResponse(**result)
