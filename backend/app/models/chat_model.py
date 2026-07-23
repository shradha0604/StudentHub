from datetime import datetime

from sqlalchemy import Column, DateTime, ForeignKey, Integer, Text
from sqlalchemy.orm import relationship

from app.utils.database import Base


class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    role = Column(Text, nullable=False)

    message = Column(Text, nullable=False)

    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship(
    "User",
    back_populates="chat_messages"
)