# AI Job Delivery Agent Backend

## Setup

1. Create virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # Linux/Mac
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Configure environment:
```bash
cp .env.example .env
# Edit .env with your settings
```

4. Initialize database:
```bash
# Using PostgreSQL CLI
psql -U postgres -c "CREATE DATABASE ai_job_delivery;"
psql -U postgres -d ai_job_delivery -f scripts/init.sql
```

5. Run server:
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## API Documentation

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Development

### Project Structure

```
backend/
├── app/
│   ├── api/          # API routes
│   ├── core/         # Core config, security
│   ├── db/           # Database connection
│   ├── models/       # SQLAlchemy models
│   ├── schemas/      # Pydantic schemas
│   ├── services/     # Business logic
│   └── automation/   # Playwright agent
├── scripts/          # SQL scripts
└── tests/           # Unit tests
```

### Running Tests

```bash
pytest tests/ -v
```
