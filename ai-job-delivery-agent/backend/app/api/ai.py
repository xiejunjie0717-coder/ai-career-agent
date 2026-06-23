"""AI API routes."""
from fastapi import APIRouter, Depends
from ..schemas.schemas import AIScoreRequest, AIScoreResponse
from ..services.ai_service import score_job, generate_personalized_message
from .deps import get_current_user
from ..models.models import User

router = APIRouter(prefix="/ai", tags=["AI"])


@router.post("/score", response_model=AIScoreResponse)
async def score_job_ai(
    request: AIScoreRequest,
    current_user: User = Depends(get_current_user)
):
    """Score a job based on AI analysis."""
    return await score_job(request)


@router.post("/generate-message")
async def generate_message(
    job_title: str,
    job_description: str,
    company_name: str,
    user_experience: str = "",
    user_skills: str = "",
    current_user: User = Depends(get_current_user)
):
    """Generate a personalized job application message."""
    message = await generate_personalized_message(
        job_title=job_title,
        job_description=job_description,
        company_name=company_name,
        user_experience=user_experience,
        user_skills=user_skills
    )
    return {"message": message}
