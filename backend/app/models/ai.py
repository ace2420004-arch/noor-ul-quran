from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from backend.app.core.database import Base

class AIConversation(Base):
    __tablename__ = "ai_conversations"

    id = Column(String(50), primary_key=True) # UUID
    user_id = Column(Integer, default=1, index=True)
    title = Column(String(255), nullable=False)
    language = Column(String(20), default="en") # "en", "ur", "hi", "hinglish", "ar"
    created_at = Column(DateTime, default=datetime.utcnow)

    messages = relationship("AIMessage", back_populates="conversation", cascade="all, delete-orphan")


class AIMessage(Base):
    __tablename__ = "ai_messages"

    id = Column(String(50), primary_key=True)
    conversation_id = Column(String(50), ForeignKey("ai_conversations.id"), nullable=False, index=True)
    sender = Column(String(20), nullable=False) # "user" or "assistant"
    content = Column(Text, nullable=False)
    citations_json = Column(Text, default="[]") # JSON list of verified source citations
    verification_status = Column(String(50), default="verified_grounded") # "verified_grounded", "unverified", "disclaimer_attached"
    created_at = Column(DateTime, default=datetime.utcnow)

    conversation = relationship("AIConversation", back_populates="messages")
