"""Message Template API routes."""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from ..db.database import get_db
from ..schemas.schemas import TemplateCreate, TemplateUpdate, TemplateResponse
from ..models.models import User, MessageTemplate
from ..services.user_service import get_user_by_id
from .deps import get_current_user
import json

router = APIRouter(prefix="/templates", tags=["Templates"])


@router.get("/", response_model=List[TemplateResponse])
async def list_templates(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """List all message templates for current user."""
    templates = db.query(MessageTemplate).filter(
        MessageTemplate.user_id == current_user.id
    ).order_by(MessageTemplate.created_at.desc()).all()
    return templates


@router.post("/", response_model=TemplateResponse, status_code=status.HTTP_201_CREATED)
async def create_template(
    template: TemplateCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new message template."""
    # If setting as default, unset other defaults
    if template.is_default:
        db.query(MessageTemplate).filter(
            MessageTemplate.user_id == current_user.id
        ).update({"is_default": False})

    db_template = MessageTemplate(
        user_id=current_user.id,
        name=template.name,
        content=template.content,
        keywords=json.dumps(template.keywords) if template.keywords else "[]",
        is_default=template.is_default
    )
    db.add(db_template)
    db.commit()
    db.refresh(db_template)
    return db_template


@router.get("/{template_id}", response_model=TemplateResponse)
async def get_template(
    template_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get a specific template."""
    template = db.query(MessageTemplate).filter(
        MessageTemplate.id == template_id,
        MessageTemplate.user_id == current_user.id
    ).first()

    if not template:
        raise HTTPException(status_code=404, detail="Template not found")

    return template


@router.put("/{template_id}", response_model=TemplateResponse)
async def update_template(
    template_id: int,
    template_update: TemplateUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update a template."""
    template = db.query(MessageTemplate).filter(
        MessageTemplate.id == template_id,
        MessageTemplate.user_id == current_user.id
    ).first()

    if not template:
        raise HTTPException(status_code=404, detail="Template not found")

    # If setting as default, unset other defaults
    if template_update.is_default:
        db.query(MessageTemplate).filter(
            MessageTemplate.user_id == current_user.id,
            MessageTemplate.id != template_id
        ).update({"is_default": False})

    update_data = template_update.model_dump(exclude_unset=True)
    if "keywords" in update_data:
        update_data["keywords"] = json.dumps(update_data["keywords"])

    for key, value in update_data.items():
        setattr(template, key, value)

    db.commit()
    db.refresh(template)
    return template


@router.delete("/{template_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_template(
    template_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a template."""
    template = db.query(MessageTemplate).filter(
        MessageTemplate.id == template_id,
        MessageTemplate.user_id == current_user.id
    ).first()

    if not template:
        raise HTTPException(status_code=404, detail="Template not found")

    db.delete(template)
    db.commit()
    return None
