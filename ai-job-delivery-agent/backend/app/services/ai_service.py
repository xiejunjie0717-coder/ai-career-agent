"""AI service for job matching and scoring."""
import openai
from ..core.config import settings
from ..schemas.schemas import AIScoreRequest, AIScoreResponse

client = openai.OpenAI(api_key=settings.OPENAI_API_KEY)


async def score_job(request: AIScoreRequest) -> AIScoreResponse:
    """Score a job based on AI analysis."""
    prompt = f"""你是一个专业的AI求职顾问。请分析以下岗位是否符合求职者的目标。

目标关键词: {', '.join(request.target_keywords) if request.target_keywords else '未指定'}

岗位名称: {request.job_title}

岗位描述:
{request.job_description}

公司介绍:
{request.company_description or '未提供'}

请从以下几个维度进行评估：
1. 技能匹配度 - 岗位要求与目标关键词的匹配程度
2. 行业相关性 - 是否属于目标行业/领域
3. 经验要求合理性 - 经验要求是否与普遍情况相符
4. 职位级别合适度 - 是否适合目标人群

请返回一个0-100的评分和简短的理由说明。

输出格式（仅返回JSON，不要其他内容）：
{{"score": 数字, "reason": "理由说明"}}
"""

    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "你是一个专业的AI求职顾问，擅长评估岗位匹配度。"},
            {"role": "user", "content": prompt}
        ],
        temperature=0.7,
        max_tokens=500
    )

    result_text = response.choices[0].message.content.strip()

    # Parse JSON response
    import json
    try:
        result = json.loads(result_text)
        return AIScoreResponse(
            score=float(result["score"]),
            reason=result["reason"]
        )
    except (json.JSONDecodeError, KeyError, ValueError):
        return AIScoreResponse(
            score=50.0,
            reason="AI评分服务暂时不可用，请稍后重试"
        )


async def generate_personalized_message(
    job_title: str,
    job_description: str,
    company_name: str,
    user_experience: str = "",
    user_skills: str = ""
) -> str:
    """Generate personalized job application message."""
    prompt = f"""你是一个求职消息生成专家。请根据以下信息生成一段个性化的Boss直聘沟通消息。

岗位名称: {job_title}
公司名称: {company_name}
岗位描述: {job_description}

求职者背景:
经历: {user_experience or '暂无'}
技能: {user_skills or '暂无'}

要求：
1. 消息长度控制在200字以内
2. 语气友好、专业、不模板化
3. 突出与岗位匹配的项目经验或技能
4. 不要使用"尊敬的"等过于正式的开头
5. 直接说明自己的优势和对该岗位的兴趣
6. 结尾表达希望进一步沟通的意愿

请直接生成消息内容，不要包含其他说明文字。
"""

    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "你是一个求职消息生成专家，擅长写个性化、有吸引力的求职消息。"},
            {"role": "user", "content": prompt}
        ],
        temperature=0.8,
        max_tokens=300
    )

    return response.choices[0].message.content.strip()
