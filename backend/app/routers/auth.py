from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.models.request_models import SignUpRequest
from app.models.response_models import AuthResponse
from app.services.auth_service import create_user
from app.utils.database import get_db
from app.models.request_models import LoginRequest
from app.models.response_models import LoginResponse
from app.services.auth_service import login_user
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from app.models.response_models import UserResponse
from app.services.auth_service import get_user_by_email
from app.utils.jwt_handler import verify_access_token

security = HTTPBearer()

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"],
)


@router.post("/signup", response_model=AuthResponse)
def signup(
    user: SignUpRequest,
    db: Session = Depends(get_db),
):
    created_user = create_user(user, db)

    if created_user is None:
        raise HTTPException(
            status_code=400,
            detail="Email already registered.",
        )

    return AuthResponse(
        message="Account created successfully!"
    )

@router.post(
    "/login",
    response_model=LoginResponse,
)
def login(
    user: LoginRequest,
    db: Session = Depends(get_db),
):

    token = login_user(
        user.email,
        user.password,
        db,
    )

    if token is None:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password",
        )

    return LoginResponse(
        access_token=token
    )

@router.get(
    "/me",
    response_model=UserResponse,
)
def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db),
):
    payload = verify_access_token(credentials.credentials)

    if payload is None:
        raise HTTPException(
            status_code=401,
            detail="Invalid token",
        )

    email = payload.get("sub")

    user = get_user_by_email(email, db)

    if user is None:
        raise HTTPException(
            status_code=404,
            detail="User not found",
        )

    return user