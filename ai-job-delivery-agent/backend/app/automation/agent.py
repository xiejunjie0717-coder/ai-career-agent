"""Playwright automation module for job delivery."""
import asyncio
import json
from typing import Optional, List, Dict, Any
from datetime import datetime
from playwright.async_api import async_playwright, Page, Browser, BrowserContext
from sqlalchemy.orm import Session
from ..models.models import JobConfig, MessageTemplate, DeliveryRecord, DeliveryStatus, User
from ..services.ai_service import score_job
import random


class JobDeliveryAgent:
    """Automation agent for job delivery on recruitment platforms."""

    def __init__(
        self,
        db: Session,
        user: User,
        job_config_id: int,
        template_id: int,
        headless: bool = True
    ):
        self.db = db
        self.user = user
        self.job_config_id = job_config_id
        self.template_id = template_id
        self.headless = headless

        self.browser: Optional[Browser] = None
        self.context: Optional[BrowserContext] = None
        self.page: Optional[Page] = None

        self.is_running = False
        self.is_paused = False
        self.should_stop = False

        self.job_config: Optional[JobConfig] = None
        self.template: Optional[MessageTemplate] = None

        self.sent_count = 0
        self.failed_count = 0

    async def initialize(self):
        """Initialize browser and load configurations."""
        self.job_config = self.db.query(JobConfig).filter(
            JobConfig.id == self.job_config_id,
            JobConfig.user_id == self.user.id
        ).first()

        self.template = self.db.query(MessageTemplate).filter(
            MessageTemplate.id == self.template_id,
            MessageTemplate.user_id == self.user.id
        ).first()

        if not self.job_config or not self.template:
            raise ValueError("Job config or template not found")

        playwright = await async_playwright().start()
        self.browser = await playwright.chromium.launch(headless=self.headless)
        self.context = await self.browser.new_context(
            viewport={"width": 1280, "height": 720},
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
        )
        self.page = await self.context.new_page()

    async def close(self):
        """Close browser and cleanup."""
        if self.page:
            await self.page.close()
        if self.context:
            await self.context.close()
        if self.browser:
            await self.browser.close()

    def pause(self):
        """Pause the automation."""
        self.is_paused = True

    def resume(self):
        """Resume the automation."""
        self.is_paused = False

    def stop(self):
        """Stop the automation."""
        self.should_stop = True
        self.is_running = False

    async def _wait_if_paused(self):
        """Wait while paused."""
        while self.is_paused and not self.should_stop:
            await asyncio.sleep(0.5)

    async def _human_delay(self, min_ms: int = 500, max_ms: int = 2000):
        """Random delay to mimic human behavior."""
        delay = random.randint(min_ms, max_ms) / 1000
        await asyncio.sleep(delay)

    async def login_boss_zhipin(self, cookies: List[Dict] = None):
        """Login to Boss Zhipin."""
        await self.page.goto("https://www.zhipin.com/", wait_until="domcontentloaded")
        await self._human_delay()

        if cookies:
            for cookie in cookies:
                await self.context.add_cookies([cookie])

        # Check if already logged in
        if await self.page.query_selector('.user-profile'):
            return True

        # Click login button if needed
        login_btn = await self.page.query_selector('.login-btn')
        if login_btn:
            await login_btn.click()
            await self._human_delay(1000, 2000)

        # Wait for manual login (in production, use proper auth)
        return False

    def _build_search_url(self) -> str:
        """Build search URL based on job config."""
        keywords = self.job_config.keywords
        if isinstance(keywords, str):
            keywords = json.loads(keywords)

        cities = self.job_config.cities
        if isinstance(cities, str):
            cities = json.loads(cities)

        base_url = "https://www.zhipin.com/web/geek/job"

        # Build query params
        params = []
        if keywords:
            params.append(f"query={' '.join(keywords)}")
        if cities:
            city_code = self._get_city_code(cities[0])
            if city_code:
                params.append(f"city={city_code}")

        if params:
            return f"{base_url}?{'&'.join(params)}"
        return base_url

    def _get_city_code(self, city_name: str) -> Optional[str]:
        """Get Boss Zhipin city code by name."""
        city_codes = {
            "北京": "101010000",
            "上海": "101020000",
            "广州": "101030000",
            "深圳": "101040000",
            "杭州": "101210100",
            "南京": "101190400",
            "成都": "101270100",
            "武汉": "101200100",
            "西安": "101110300",
            "苏州": "101190500",
            "天津": "101030000",
            "重庆": "101040000",
            "长沙": "101250100",
            "郑州": "101180100",
            "青岛": "101120200",
            "济南": "101120600",
            "福州": "101190100",
            "厦门": "101230200",
            "合肥": "101220100",
            "昆明": "101290100",
            "沈阳": "101070400",
            "大连": "101070200",
            "哈尔滨": "101050100",
        }
        return city_codes.get(city_name)

    async def _scrape_job_list(self) -> List[Dict[str, Any]]:
        """Scrape job list from search results."""
        jobs = []

        # Wait for job list to load
        await self.page.wait_for_selector('.job-list-box', timeout=10000)

        job_cards = await self.page.query_selector_all('.job-card-box')

        for card in job_cards:
            try:
                # Extract job info
                title_elem = await card.query_selector('.job-title')
                title = await title_elem.inner_text() if title_elem else ""

                company_elem = await card.query_selector('.company-name')
                company = await company_elem.inner_text() if company_elem else ""

                salary_elem = await card.query_selector('.salary')
                salary = await salary_elem.inner_text() if salary_elem else ""

                location_elem = await card.query_selector('.job-area')
                location = await location_elem.inner_text() if location_elem else ""

                # Get job URL
                link = await card.get_attribute('data-jobid')
                job_url = f"https://www.zhipin.com/job_detail/{link}.html" if link else ""

                jobs.append({
                    "title": title.strip(),
                    "company": company.strip(),
                    "salary": salary.strip(),
                    "location": location.strip(),
                    "url": job_url
                })
            except Exception as e:
                print(f"Error extracting job card: {e}")
                continue

        return jobs

    async def _scrape_job_detail(self, job_url: str) -> Optional[str]:
        """Scrape job detail page."""
        try:
            await self.page.goto(job_url, wait_until="domcontentloaded")
            await self._human_delay(1000, 2000)

            # Wait for job description
            await self.page.wait_for_selector('.job-detail-box', timeout=5000)

            desc_elem = await self.page.query_selector('.job-detail-text')
            description = await desc_elem.inner_text() if desc_elem else ""

            return description.strip()
        except Exception as e:
            print(f"Error scraping job detail: {e}")
            return None

    async def _send_message(self) -> bool:
        """Send message on job detail page."""
        try:
            # Click send message button
            msg_btn = await self.page.query_selector('.btn-start-chat')
            if msg_btn:
                await msg_btn.click()
                await self._human_delay(500, 1000)

            # Wait for message input
            await self.page.wait_for_selector('.chat-input', timeout=5000)

            # Type message
            msg_input = await self.page.query_selector('.chat-input')
            if msg_input:
                await msg_input.fill(self.template.content)
                await self._human_delay(300, 800)

                # Click send button
                send_btn = await self.page.query_selector('.chat-send-btn')
                if send_btn:
                    await send_btn.click()
                    await self._human_delay(500, 1000)
                    return True

            return False
        except Exception as e:
            print(f"Error sending message: {e}")
            return False

    async def _score_and_filter(self, job: Dict[str, Any]) -> tuple[float, str]:
        """Score job using AI and filter."""
        keywords = self.template.keywords
        if isinstance(keywords, str):
            keywords = json.loads(keywords)

        try:
            score_result = await score_job(AIScoreRequest(
                job_title=job["title"],
                job_description=job.get("description", ""),
                target_keywords=keywords
            ))
            return score_result.score, score_result.reason
        except Exception:
            return 50.0, "AI评分服务暂时不可用"

    async def run(self):
        """Main execution loop."""
        self.is_running = True
        self.sent_count = 0
        self.failed_count = 0

        try:
            await self.initialize()

            # Navigate to search results
            search_url = self._build_search_url()
            await self.page.goto(search_url, wait_until="domcontentloaded")
            await self._human_delay(2000, 4000)

            page_count = 0
            max_pages = 10  # Limit pages per run

            while not self.should_stop and page_count < max_pages:
                await self._wait_if_paused()

                if self.should_stop:
                    break

                # Scrape jobs from current page
                jobs = await self._scrape_job_list()

                for job in jobs:
                    await self._wait_if_paused()

                    if self.should_stop:
                        break

                    # Scrape job detail
                    if job["url"]:
                        job["description"] = await self._scrape_job_detail(job["url"])

                    # Score job
                    score, reason = await self._score_and_filter(job)

                    # Create delivery record
                    record = DeliveryRecord(
                        user_id=self.user.id,
                        template_id=self.template_id,
                        job_config_id=self.job_config_id,
                        job_title=job["title"],
                        company_name=job["company"],
                        salary=job["salary"],
                        location=job["location"],
                        job_url=job.get("url", ""),
                        job_description=job.get("description", ""),
                        ai_score=score,
                        ai_reason=reason,
                        status=DeliveryStatus.PENDING
                    )
                    self.db.add(record)
                    self.db.commit()

                    # Only send if score >= 70
                    if score >= 70:
                        if job["url"]:
                            await self.page.goto(job["url"], wait_until="domcontentloaded")
                            await self._human_delay(1000, 2000)

                            success = await self._send_message()
                            if success:
                                record.status = DeliveryStatus.SENT
                                record.sent_at = datetime.utcnow()
                                self.sent_count += 1
                            else:
                                self.failed_count += 1
                        else:
                            self.failed_count += 1

                        self.db.commit()
                    else:
                        self.failed_count += 1
                        self.db.commit()

                    await self._human_delay(1000, 3000)

                # Go to next page
                next_btn = await self.page.query_selector('.next-btn')
                if next_btn and not self.should_stop:
                    await next_btn.click()
                    await self._human_delay(2000, 4000)
                    page_count += 1
                else:
                    break

        except Exception as e:
            print(f"Error in automation run: {e}")
        finally:
            self.is_running = False
            await self.close()

    async def get_status(self) -> Dict[str, Any]:
        """Get current status of the agent."""
        return {
            "is_running": self.is_running,
            "is_paused": self.is_paused,
            "sent_count": self.sent_count,
            "failed_count": self.failed_count,
            "job_config": self.job_config.name if self.job_config else None,
            "template": self.template.name if self.template else None
        }
