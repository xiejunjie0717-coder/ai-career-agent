# AI Job Delivery Agent

帮助求职者自动在Boss直聘等招聘平台搜索岗位并发送预设求职消息，减少重复投递工作。

## 功能特性

### 1. 用户登录
- 邮箱登录
- JWT鉴权
- 独立数据空间

### 2. 消息模板管理
- 创建多个求职消息模板
- 关键词管理
- 默认模板设置
- 预览功能

### 3. 岗位搜索配置
- 关键词配置（支持多个）
- 城市选择（支持多个）
- 薪资范围筛选
- 学历要求
- 公司规模

### 4. AI岗位过滤
- 调用OpenAI API进行智能评分
- 技能匹配度分析
- 70分以下岗位自动过滤

### 5. 投递记录CRM
- 完整的投递状态管理
- 搜索、筛选、分页
- CSV导出
- 状态更新（已发送、已回复、面试中、Offer、拒绝）

### 6. 数据统计
- 今日发送数量
- 累计发送数量
- 回复率、面试率、Offer率
- 可视化图表展示

### 7. 自动投递Agent（开发中）
- Playwright浏览器自动化
- 支持暂停、继续、停止
- 自动登录Boss直聘
- 自动搜索和筛选岗位
- 自动发送消息

## 技术栈

### 前端
- Next.js 15
- TypeScript
- TailwindCSS
- shadcn/ui
- TanStack Query
- Zustand
- Recharts

### 后端
- FastAPI
- SQLAlchemy
- Pydantic
- Python-Jose (JWT)
- Playwright

### 数据库
- PostgreSQL 15

### 部署
- Docker
- Docker Compose

## 项目结构

```
ai-job-delivery-agent/
├── backend/
│   ├── app/
│   │   ├── api/            # API路由
│   │   ├── core/           # 核心配置（安全、配置）
│   │   ├── db/             # 数据库连接
│   │   ├── models/         # SQLAlchemy模型
│   │   ├── schemas/        # Pydantic模式
│   │   ├── services/       # 业务逻辑
│   │   └── automation/     # Playwright自动化
│   ├── scripts/            # SQL脚本
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── app/
│   │   ├── dashboard/      # 仪表板页面
│   │   ├── login/         # 登录页
│   │   └── register/      # 注册页
│   ├── components/        # React组件
│   │   ├── ui/           # UI基础组件
│   │   └── layout/       # 布局组件
│   ├── lib/
│   │   ├── api/          # API客户端
│   │   └── stores/       # Zustand状态
│   ├── types/            # TypeScript类型
│   ├── package.json
│   └── Dockerfile
├── docker/
│   └── docker-compose.yml
├── scripts/
│   └── init.sql          # 数据库初始化
├── .env.example
└── README.md
```

## 快速开始

### 环境要求
- Docker & Docker Compose
- Node.js 20+ (本地开发)
- Python 3.11+ (本地开发)

### 1. 配置环境变量

```bash
cp .env.example .env
```

编辑 `.env` 文件，填入必要的配置：
- `SECRET_KEY`: JWT密钥
- `OPENAI_API_KEY`: OpenAI API密钥

### 2. 使用Docker启动

```bash
cd docker
docker-compose up -d
```

服务启动后：
- 前端: http://localhost:3000
- 后端API: http://localhost:8000
- API文档: http://localhost:8000/docs

### 3. 本地开发

#### 后端
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Linux/Mac
pip install -r requirements.txt

# 初始化数据库
psql -U postgres -c "CREATE DATABASE ai_job_delivery;"
psql -U postgres -d ai_job_delivery -f ../scripts/init.sql

# 运行服务器
uvicorn app.main:app --reload --port 8000
```

#### 前端
```bash
cd frontend
npm install
npm run dev
```

## API文档

启动后端服务后，访问 http://localhost:8000/docs 查看完整的Swagger API文档。

### 主要接口

| 方法 | 路径 | 描述 |
|------|------|------|
| POST | /api/auth/login | 用户登录 |
| POST | /api/auth/register | 用户注册 |
| GET | /api/templates/ | 获取模板列表 |
| POST | /api/templates/ | 创建模板 |
| PUT | /api/templates/{id} | 更新模板 |
| DELETE | /api/templates/{id} | 删除模板 |
| GET | /api/job-configs/ | 获取岗位配置列表 |
| POST | /api/job-configs/ | 创建岗位配置 |
| GET | /api/deliveries/ | 获取投递记录列表 |
| POST | /api/deliveries/ | 创建投递记录 |
| GET | /api/deliveries/stats | 获取统计数据 |
| POST | /api/ai/score | AI岗位评分 |

## 数据库

### 表结构

#### users
| 字段 | 类型 | 描述 |
|------|------|------|
| id | SERIAL | 主键 |
| email | VARCHAR(255) | 邮箱（唯一） |
| hashed_password | VARCHAR(255) | 加密密码 |
| full_name | VARCHAR(255) | 姓名 |
| is_active | BOOLEAN | 是否激活 |
| created_at | TIMESTAMP | 创建时间 |

#### message_templates
| 字段 | 类型 | 描述 |
|------|------|------|
| id | SERIAL | 主键 |
| user_id | INTEGER | 用户ID |
| name | VARCHAR(255) | 模板名称 |
| content | TEXT | 模板内容 |
| keywords | TEXT | 关键词（JSON数组） |
| is_default | BOOLEAN | 是否默认 |
| created_at | TIMESTAMP | 创建时间 |

#### job_configs
| 字段 | 类型 | 描述 |
|------|------|------|
| id | SERIAL | 主键 |
| user_id | INTEGER | 用户ID |
| name | VARCHAR(255) | 配置名称 |
| keywords | TEXT | 搜索关键词 |
| cities | TEXT | 城市列表 |
| salary_range | VARCHAR(50) | 薪资范围 |
| education | VARCHAR(50) | 学历要求 |
| company_size | TEXT | 公司规模 |
| is_active | BOOLEAN | 是否启用 |

#### delivery_records
| 字段 | 类型 | 描述 |
|------|------|------|
| id | SERIAL | 主键 |
| user_id | INTEGER | 用户ID |
| template_id | INTEGER | 模板ID |
| job_config_id | INTEGER | 配置ID |
| job_title | VARCHAR(255) | 岗位名称 |
| company_name | VARCHAR(255) | 公司名称 |
| salary | VARCHAR(100) | 薪资 |
| location | VARCHAR(255) | 城市 |
| job_url | TEXT | 职位链接 |
| job_description | TEXT | 职位描述 |
| ai_score | DECIMAL | AI评分 |
| ai_reason | TEXT | AI评分理由 |
| status | VARCHAR(50) | 状态 |
| sent_at | TIMESTAMP | 发送时间 |
| replied_at | TIMESTAMP | 回复时间 |
| created_at | TIMESTAMP | 创建时间 |

## 开发说明

### 前端开发
```bash
cd frontend
npm run dev      # 开发模式
npm run build    # 生产构建
npm run lint    # 代码检查
```

### 后端开发
```bash
cd backend
uvicorn app.main:app --reload  # 开发模式
pytest tests/ -v               # 运行测试
```

## 部署

### Docker Compose
```bash
cd docker
docker-compose up -d --build
```

### 生产环境
- 确保修改默认的 `SECRET_KEY`
- 配置SSL证书
- 使用真实的数据库而非Docker卷
- 设置合适的CORS策略

## License

MIT
