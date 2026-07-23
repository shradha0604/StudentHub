from fastapi import APIRouter, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session

from app.utils.database import get_db
from app.utils.jwt_handler import verify_access_token
from app.services.auth_service import get_user_by_email

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)

security = HTTPBearer()


@router.get("/stats")
def dashboard_stats(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):

    payload = verify_access_token(credentials.credentials)

    email = payload["sub"]

    user = get_user_by_email(email, db)

    return {
        "reading_time": 0,
        "daily_goal": 60,
        "pages_read": 0,
        "streak": 0,
        "ai_questions": 0
    }