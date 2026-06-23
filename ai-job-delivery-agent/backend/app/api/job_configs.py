"""Job Config API routes."""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from ..db.database import get_db
from ..schemas.schemas import JobConfigCreate, JobConfigUpdate, JobConfigResponse
from ..models.models import User, JobConfig
from .deps import get_current_user
import json

router = APIRouter(prefix="/job-configs", tags=["Job Configs"])


@router.get("/", response_model=List[JobConfigResponse])
async def list_job_configs(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """List all job configurations for current user."""
    configs = db.query(JobConfig).filter(
        JobConfig.user_id == current_user.id
    ).order_by(JobConfig.created_at.desc()).all()
    return configs


@router.post("/", response_model=JobConfigResponse, status_code=status.HTTP_201_CREATED)
async def create_job_config(
    config: JobConfigCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new job configuration."""
    db_config = JobConfig(
        user_id=current_user.id,
        name=config.name,
        keywords=json.dumps(config.keywords),
        cities=json.dumps(config.cities) if config.cities else "[]",
        salary_range=config.salary_range,
        education=config.education,
        company_size=json.dumps(config.company_size) if config.company_size else "[]",
        is_active=config.is_active
    )
    db.add(db_config)
    db.commit()
    db.refresh(db_config)
    return db_config


@router.get("/{config_id}", response_model=JobConfigResponse)
async def get_job_config(
    config_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get a specific job configuration."""
    config = db.query(JobConfig).filter(
        JobConfig.id == config_id,
        JobConfig.user_id == current_user.id
    ).first()

    if not config:
        raise HTTPException(status_code=404, detail="Config not found")

    return config


@router.put("/{config_id}", response_model=JobConfigResponse)
async def update_job_config(
    config_id: int,
    config_update: JobConfigUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update a job configuration."""
    config = db.query(JobConfig).filter(
        JobConfig.id == config_id,
        JobConfig.user_id == current_user.id
    ).first()

    if not config:
        raise HTTPException(status_code=404, detail="Config not found")

    update_data = config_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        if value is not None and key in ["keywords", "cities", "company_size"]:
            setattr(config, key, json.dumps(value))
        else:
            setattr(config, key, value)

    db.commit()
    db.refresh(config)
    return config


@router.delete("/{config_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_job_config(
    config_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a job configuration."""
    config = db.query(JobConfig).filter(
        JobConfig.id == config_id,
        JobConfig.user_id == current_user.id
    ).first()

    if not config:
        raise HTTPException(status_code=404, detail="Config not found")

    db.delete(config)
    db.commit()
    return None
