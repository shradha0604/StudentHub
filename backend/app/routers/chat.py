"""
Chat router -- AI Tutor feature.

POST /chat             -> standard JSON response
POST /chat?stream=true -> Server-Sent Events streaming response
"""

from fastapi import APIRouter, Query
from sse_starlette.sse import EventSourceResponse

from app.models.request_models import ChatRequest
from app.models.response_models import ChatResponse
from app.services.ai_service import ai_service
from app.utils.logger import get_logger
from fastapi import Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from app.services.chat_service import (
    save_message,
    get_recent_messages,
)
from app.services.auth_service import get_user_by_email
from app.utils.database import get_db
from app.utils.jwt_handler import verify_access_token


logger = get_logger(__name__)

router = APIRouter(tags=["Chat"])


@router.post("/chat", response_model=None)
async def chat(
    payload: ChatRequest,
    stream: bool = Query(default=False),
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db),
):
    logger.info(
        "POST /chat | stream=%s | message_length=%d", stream, len(payload.message)
    )

    if stream:
        return EventSourceResponse(_stream_chat_events(payload.message))

    payload_token = verify_access_token(credentials.credentials)

if payload_token is None:
    raise HTTPException(
        status_code=401,
        detail="Invalid token",
    )

email = payload_token.get("sub")

user = get_user_by_email(email, db)

history = get_recent_messages(
    db,
    user.id,
)

reply = await ai_service.generate_chat(
    payload.message,
    history,
)

save_message(
    db,
    user.id,
    "user",
    payload.message,
)

save_message(
    db,
    user.id,
    "assistant",
    reply,
)

return ChatResponse(reply=reply)


async def _stream_chat_events(message: str):
    """
    Yields SSE-formatted events as chunks arrive from the LLM.
    Sends a final 'done' event so the frontend knows the stream ended.
    """
    try:
        async for chunk in ai_service.generate_chat_stream(message):
            yield {"event": "message", "data": chunk}
        yield {"event": "done", "data": "[DONE]"}
    except Exception as exc:  # noqa: BLE001
        logger.error("Error during chat stream: %s", exc)
        yield {"event": "error", "data": "An error occurred during streaming."}
