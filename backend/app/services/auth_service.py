from sqlalchemy.orm import Session

from app.models.user_model import User
from app.models.request_models import SignUpRequest
from app.utils.hashing import hash_password


def create_user(user: SignUpRequest, db: Session):
    # Check if email already exists
    existing_user = db.query(User).filter(User.email == user.email).first()

    if existing_user:
        return None

    new_user = User(
        full_name=user.full_name,
        email=user.email,
        hashed_password=hash_password(user.password),
        college_name=user.college_name,
        course=user.course,
        year_of_study=user.year_of_study,
        date_of_birth=user.date_of_birth,
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user

from app.utils.hashing import verify_password
from app.utils.jwt_handler import create_access_token


def login_user(email: str, password: str, db: Session):

    user = db.query(User).filter(User.email == email).first()

    if user is None:
        return None

    if not verify_password(password, user.hashed_password):
        return None

    token = create_access_token(
        {
            "sub": user.email
        }
    )

    return token

def get_user_by_email(email: str, db: Session):
    return db.query(User).filter(User.email == email).first()