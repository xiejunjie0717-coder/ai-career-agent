"""Delivery Record API routes."""
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional
from datetime import datetime, timedelta
from ..db.database import get_db
from ..schemas.schemas import (
    DeliveryRecordCreate, DeliveryRecordUpdate, DeliveryRecordResponse, StatsResponse
)
from ..models.models import User, DeliveryRecord, DeliveryStatus
from .deps import get_current_user
import json

router = APIRouter(prefix="/deliveries", tags=["Deliveries"])


@router.get("/", response_model=List[DeliveryRecordResponse])
async def list_deliveries(
    status_filter: Optional[DeliveryStatus] = Query(None, alias="status"),
    search: Optional[str] = None,
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """List delivery records with filtering and pagination."""
    query = db.query(DeliveryRecord).filter(
        DeliveryRecord.user_id == current_user.id
    )

    if status_filter:
        query = query.filter(DeliveryRecord.status == status_filter)

    if search:
        search_pattern = f"%{search}%"
        query = query.filter(
            (DeliveryRecord.job_title.ilike(search_pattern)) |
            (DeliveryRecord.company_name.ilike(search_pattern))
        )

    total = query.count()
    records = query.order_by(DeliveryRecord.created_at.desc()).offset(
        (page - 1) * page_size
    ).limit(page_size).all()

    return records


@router.post("/", response_model=DeliveryRecordResponse, status_code=status.HTTP_201_CREATED)
async def create_delivery_record(
    record: DeliveryRecordCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new delivery record."""
    db_record = DeliveryRecord(
        user_id=current_user.id,
        template_id=record.template_id,
        job_config_id=record.job_config_id,
        job_title=record.job_title,
        company_name=record.company_name,
        salary=record.salary,
        location=record.location,
        job_url=record.job_url,
        job_description=record.job_description,
        ai_score=record.ai_score,
        ai_reason=record.ai_reason
    )
    db.add(db_record)
    db.commit()
    db.refresh(db_record)
    return db_record


@router.get("/stats", response_model=StatsResponse)
async def get_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get delivery statistics."""
    today = datetime.utcnow().date()
    today_start = datetime.combine(today, datetime.min.time())

    base_query = db.query(DeliveryRecord).filter(
        DeliveryRecord.user_id == current_user.id
    )

    # Today's sent count
    today_sent = base_query.filter(
        DeliveryRecord.sent_at >= today_start,
        DeliveryRecord.status == DeliveryStatus.SENT
    ).count()

    # Total counts
    total_sent = base_query.filter(DeliveryRecord.status == DeliveryStatus.SENT).count()
    total_replied = base_query.filter(DeliveryRecord.status == DeliveryStatus.REPLIED).count()
    total_interview = base_query.filter(DeliveryRecord.status == DeliveryStatus.INTERVIEW).count()
    total_offer = base_query.filter(DeliveryRecord.status == DeliveryStatus.OFFER).count()

    # Calculate rates
    reply_rate = (total_replied / total_sent * 100) if total_sent > 0 else 0
    interview_rate = (total_interview / total_sent * 100) if total_sent > 0 else 0
    offer_rate = (total_offer / total_sent * 100) if total_sent > 0 else 0

    return StatsResponse(
        today_sent=today_sent,
        total_sent=total_sent,
        total_replied=total_replied,
        total_interview=total_interview,
        total_offer=total_offer,
        reply_rate=round(reply_rate, 1),
        interview_rate=round(interview_rate, 1),
        offer_rate=round(offer_rate, 1)
    )


@router.get("/export")
async def export_deliveries(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Export delivery records as CSV."""
    records = db.query(DeliveryRecord).filter(
        DeliveryRecord.user_id == current_user.id
    ).order_by(DeliveryRecord.created_at.desc()).all()

    # Generate CSV content
    csv_lines = ["ID,岗位名称,公司名称,薪资,城市,AI评分,AI理由,状态,发送时间,回复时间"]

    for record in records:
        csv_lines.append(
            f'{record.id},'
            f'"{record.job_title}",'
            f'"{record.company_name}",'
            f'"{record.salary or ""}",'
            f'"{record.location or ""}",'
            f'{record.ai_score or ""},'
            f'"{record.ai_reason or ""}",'
            f'{record.status.value},'
            f'{record.sent_at.isoformat() if record.sent_at else ""},'
            f'{record.replied_at.isoformat() if record.replied_at else ""}'
        )

    return "\n".join(csv_lines)


@router.get("/{record_id}", response_model=DeliveryRecordResponse)
async def get_delivery_record(
    record_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get a specific delivery record."""
    record = db.query(DeliveryRecord).filter(
        DeliveryRecord.id == record_id,
        DeliveryRecord.user_id == current_user.id
    ).first()

    if not record:
        raise HTTPException(status_code=404, detail="Record not found")

    return record


@router.put("/{record_id}", response_model=DeliveryRecordResponse)
async def update_delivery_record(
    record_id: int,
    record_update: DeliveryRecordUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update a delivery record."""
    record = db.query(DeliveryRecord).filter(
        DeliveryRecord.id == record_id,
        DeliveryRecord.user_id == current_user.id
    ).first()

    if not record:
        raise HTTPException(status_code=404, detail="Record not found")

    update_data = record_update.model_dump(exclude_unset=True)

    # Handle status change for sent_at
    if "status" in update_data:
        if update_data["status"] == DeliveryStatus.SENT and record.status != DeliveryStatus.SENT:
            update_data["sent_at"] = datetime.utcnow()
        elif update_data["status"] == DeliveryStatus.REPLIED and record.replied_at is None:
            update_data["replied_at"] = datetime.utcnow()

    for key, value in update_data.items():
        setattr(record, key, value)

    db.commit()
    db.refresh(record)
    return record


@router.delete("/{record_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_delivery_record(
    record_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a delivery record."""
    record = db.query(DeliveryRecord).filter(
        DeliveryRecord.id == record_id,
        DeliveryRecord.user_id == current_user.id
    ).first()

    if not record:
        raise HTTPException(status_code=404, detail="Record not found")

    db.delete(record)
    db.commit()
    return None
