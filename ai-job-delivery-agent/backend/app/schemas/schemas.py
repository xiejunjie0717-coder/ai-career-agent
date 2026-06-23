"""Pydantic schemas."""
from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime
from .models import DeliveryStatus


# ============ User Schemas ============

class UserBase(BaseModel):
    email: EmailStr
    full_name: Optional[str] = None


class UserCreate(UserBase):
    password: str = Field(..., min_length=6)


class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    password: Optional[str] = None


class UserResponse(UserBase):
    id: int
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True


# ============ Auth Schemas ============

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class TokenPayload(BaseModel):
    sub: int


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


# ============ Message Template Schemas ============

class TemplateBase(BaseModel):
    name: str
    content: str
    keywords: Optional[List[str]] = []
    is_default: bool = False


class TemplateCreate(TemplateBase):
    pass


class TemplateUpdate(BaseModel):
    name: Optional[str] = None
    content: Optional[str] = None
    keywords: Optional[List[str]] = None
    is_default: Optional[bool] = None


class TemplateResponse(TemplateBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# ============ Job Config Schemas ============

class JobConfigBase(BaseModel):
    name: str
    keywords: List[str]
    cities: Optional[List[str]] = []
    salary_range: Optional[str] = None
    education: Optional[str] = None
    company_size: Optional[List[str]] = []
    is_active: bool = True


class JobConfigCreate(JobConfigBase):
    pass


class JobConfigUpdate(BaseModel):
    name: Optional[str] = None
    keywords: Optional[List[str]] = None
    cities: Optional[List[str]] = None
    salary_range: Optional[str] = None
    education: Optional[str] = None
    company_size: Optional[List[str]] = None
    is_active: Optional[bool] = None


class JobConfigResponse(JobConfigBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# ============ Delivery Record Schemas ============

class DeliveryRecordBase(BaseModel):
    job_title: str
    company_name: str
    salary: Optional[str] = None
    location: Optional[str] = None
    job_url: Optional[str] = None
    job_description: Optional[str] = None


class DeliveryRecordCreate(DeliveryRecordBase):
    template_id: Optional[int] = None
    job_config_id: Optional[int] = None
    ai_score: Optional[float] = None
    ai_reason: Optional[str] = None


class DeliveryRecordUpdate(BaseModel):
    status: Optional[DeliveryStatus] = None
    notes: Optional[str] = None
    replied_at: Optional[datetime] = None


class DeliveryRecordResponse(DeliveryRecordBase):
    id: int
    user_id: int
    template_id: Optional[int]
    job_config_id: Optional[int]
    ai_score: Optional[float]
    ai_reason: Optional[str]
    status: DeliveryStatus
    sent_at: Optional[datetime]
    replied_at: Optional[datetime]
    notes: Optional[str]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# ============ AI Scoring Schemas ============

class AIScoreRequest(BaseModel):
    job_title: str
    job_description: str
    company_description: Optional[str] = None
    target_keywords: Optional[List[str]] = []


class AIScoreResponse(BaseModel):
    score: float
    reason: str


# ============ Statistics Schemas ============

class StatsResponse(BaseModel):
    today_sent: int
    total_sent: int
    total_replied: int
    total_interview: int
    total_offer: int
    reply_rate: float
    interview_rate: float
    offer_rate: float


# ============ Pagination Schemas ============

class PaginatedResponse(BaseModel):
    items: List
    total: int
    page: int
    page_size: int
    total_pages: int
