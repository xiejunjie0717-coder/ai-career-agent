"""Database models."""
from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey, Float, Enum as SQLEnum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..db.database import Base
import enum


class DeliveryStatus(str, enum.Enum):
    """Delivery status enum."""
    PENDING = "pending"
    SENT = "sent"
    REPLIED = "replied"
    INTERVIEW = "interview"
    OFFER = "offer"
    REJECTED = "rejected"


class User(Base):
    """User model."""
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255))
    is_active = Column(Boolean, default=True)
    is_superuser = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    templates = relationship("MessageTemplate", back_populates="user", cascade="all, delete-orphan")
    job_configs = relationship("JobConfig", back_populates="user", cascade="all, delete-orphan")
    delivery_records = relationship("DeliveryRecord", back_populates="user", cascade="all, delete-orphan")


class MessageTemplate(Base):
    """Message template model."""
    __tablename__ = "message_templates"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    name = Column(String(255), nullable=False)
    content = Column(Text, nullable=False)
    keywords = Column(Text)  # JSON string array
    is_default = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    user = relationship("User", back_populates="templates")
    delivery_records = relationship("DeliveryRecord", back_populates="template")


class JobConfig(Base):
    """Job search configuration model."""
    __tablename__ = "job_configs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    name = Column(String(255), nullable=False)
    keywords = Column(Text, nullable=False)  # JSON string array
    cities = Column(Text)  # JSON string array
    salary_range = Column(String(50))  # e.g., "150-300/天", "8K-15K", "不限"
    education = Column(String(50))  # 大专, 本科, 硕士, 不限
    company_size = Column(Text)  # JSON string array
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    user = relationship("User", back_populates="job_configs")
    delivery_records = relationship("DeliveryRecord", back_populates="job_config")


class DeliveryRecord(Base):
    """Delivery record model for CRM."""
    __tablename__ = "delivery_records"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    template_id = Column(Integer, ForeignKey("message_templates.id"), nullable=True)
    job_config_id = Column(Integer, ForeignKey("job_configs.id"), nullable=True)

    # Job info
    job_title = Column(String(255), nullable=False)
    company_name = Column(String(255), nullable=False)
    salary = Column(String(100))
    location = Column(String(255))
    job_url = Column(Text)
    job_description = Column(Text)

    # AI scoring
    ai_score = Column(Float, nullable=True)
    ai_reason = Column(Text, nullable=True)

    # Status
    status = Column(SQLEnum(DeliveryStatus), default=DeliveryStatus.PENDING)
    sent_at = Column(DateTime(timezone=True), nullable=True)
    replied_at = Column(DateTime(timezone=True), nullable=True)

    # Additional info
    notes = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    user = relationship("User", back_populates="delivery_records")
    template = relationship("MessageTemplate", back_populates="delivery_records")
    job_config = relationship("JobConfig", back_populates="delivery_records")
