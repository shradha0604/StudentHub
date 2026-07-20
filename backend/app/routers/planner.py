"""
Planner router -- Study Planner feature.

POST /planner
"""

from fastapi import APIRouter

from app.models.request_models import PlannerRequest
from app.models.response_models import PlannerResponse
from app.services.ai_service import ai_service
from app.utils.logger import get_logger

logger = get_logger(__name__)

router = APIRouter(tags=["Planner"])


@router.post("/planner", response_model=PlannerResponse)
async def planner(payload: PlannerRequest) -> PlannerResponse:
    logger.info(
        "POST /planner | subject=%s | exam_date=%s | hours_per_day=%d",
        payload.subject,
        payload.exam_date,
        payload.hours_per_day,
    )

    result = await ai_service.generate_planner(
        subject=payload.subject,
        exam_date=payload.exam_date,
        hours_per_day=payload.hours_per_day,
    )
    return PlannerResponse(**result)
