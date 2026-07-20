"""
Summarize router -- Notes Summarizer feature.

POST /summarize
"""

from fastapi import APIRouter

from app.models.request_models import SummarizeRequest
from app.models.response_models import SummarizeResponse
from app.services.ai_service import ai_service
from app.utils.logger import get_logger

logger = get_logger(__name__)

router = APIRouter(tags=["Summarize"])


@router.post("/summarize", response_model=SummarizeResponse)
async def summarize(payload: SummarizeRequest) -> SummarizeResponse:
    logger.info("POST /summarize | notes_length=%d", len(payload.notes))

    result = await ai_service.generate_summary(payload.notes)
    return SummarizeResponse(**result)
