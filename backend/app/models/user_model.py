from sqlalchemy import Column, Integer, String, DateTime, Date
from sqlalchemy.orm import relationship
from datetime import datetime
from app.utils.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    full_name = Column(String, nullable=False)

    email = Column(String, unique=True, index=True, nullable=False)

    hashed_password = Column(String, nullable=False)

    college_name = Column(String, nullable=False)

    course = Column(String, nullable=False)

    year_of_study = Column(String, nullable=False)

    created_at = Column(DateTime, default=datetime.utcnow)

    date_of_birth = Column(Date, nullable=False)

    chat_messages = relationship(
    "ChatMessage",
    back_populates="user",
    cascade="all, delete-orphan"
)