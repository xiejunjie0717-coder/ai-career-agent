# Pathwise Career

> 面向求职准备场景，将岗位分析、能力诊断、成长规划、作品集准备和面试执行串联起来的 AI 职业成长 Workflow MVP。

Pathwise Career 是一个本地运行的职业成长产品原型。用户可以从目标岗位或真实 JD 出发，逐步生成岗位画像、能力画像、差距报告、学习路线、项目推荐、简历优化建议和模拟面试报告，并将学习、项目与面试建议汇总为可跟踪的执行任务。

当前项目用于验证 AI Agent Workflow 在求职准备场景中的产品价值，不是完整的招聘平台或商业化职业服务。

## 文档导航

- [项目架构与数据流](docs/architecture.md)
- [Agent Workflow 与节点说明](docs/agent-workflow.md)
- [3 分钟 Demo 演示稿](docs/demo-script.md)
- [项目面试讲解指南](docs/interview-guide.md)
- [简历项目经历草稿](docs/resume-bullets.md)

## 目标用户

- 正在准备求职或转岗的学生、应届生和初级职场人
- 希望进入 AI 产品、产品经理、数据分析或技术岗位的用户
- 需要把岗位要求转化为学习计划、作品集项目和面试准备行动的求职者

## 用户痛点

- JD 信息复杂，难以快速识别岗位真正关注的职责、技能和评估标准
- 不清楚个人能力与目标岗位之间的具体差距及补齐优先级
- 学习、项目、简历和面试准备分散在不同工具中，缺少连续上下文
- 获得建议后缺少可执行、可跟踪的下一步任务
- 项目经历难以转化为简历表达和结构化面试讲法

## 核心功能

### 分析

- 设置目标岗位与目标公司
- 上传 PDF 格式 JD，并提取文本
- 生成 `JobProfile` 岗位画像
- 生成 `AbilityProfile` 用户能力画像
- 对比岗位与个人能力，生成 `GapReport`

### 规划

- 根据关键差距生成阶段化 `Roadmap`
- 根据岗位、能力短板和路线生成三档 `ProjectRecommendation`
- 生成岗位相关的 `ResumeReport`
- 生成模拟面试题、回答评分与 `InterviewReport`

### 执行与反馈

- 从学习路线、项目交付物和面试建议生成 Tasks
- 跟踪任务的待办、进行中和已完成状态
- 在 Dashboard 汇总主链路进度、匹配度和下一步动作
- 在 Profile 汇总技能、项目、任务和成长指标
- 提供 PDF 全文知识库问答原型

## Agent Workflow

```text
目标岗位 / JD
  → JobProfile 岗位画像
  → AbilityProfile 能力画像
  → GapReport 差距报告
  → Roadmap 学习路线
  → ProjectRecommendation 项目推荐
  → ResumeReport 简历优化
  → InterviewReport 模拟面试
  → Tasks 执行中心
  → Dashboard / Profile 进度反馈
```

工作流优先复用前序结构化结果，而不是让每个 AI 功能成为互相独立的对话入口。例如：

- 能力画像会参考岗位画像
- 项目推荐会参考岗位画像、能力画像、差距报告和学习路线
- 简历优化会参考岗位要求和推荐项目
- 模拟面试会参考目标岗位、项目经历与简历报告
- Tasks 会汇总路线任务、项目交付物和面试练习建议
- Dashboard 与 Profile 会根据当前 `AgentState` 和任务状态计算真实进度

完整节点说明见 [Agent Workflow 文档](docs/agent-workflow.md)。

## 技术架构

- React 19 + TypeScript
- TanStack Router / TanStack Start
- Vite
- Tailwind CSS 4
- TanStack Start server functions
- `localStorage` 本地状态持久化
- SiliconFlow OpenAI 兼容接口
- `deepseek-ai/DeepSeek-V3` 模型
- Tavily Search API
- PDF.js 浏览器端 PDF 文本提取
- Node.js Test Runner 核心逻辑测试

页面通过 TanStack Router 组织。核心状态集中定义在 `src/lib/agent-store.ts`，通过 `loadState` 和 `saveState` 读写当前浏览器的 `localStorage`。AI 和搜索请求由 server function 接收，再调用服务端模块访问 SiliconFlow 或 Tavily。

详细边界和调用关系见 [项目架构文档](docs/architecture.md)。

## 数据结构

| 数据结构 | 作用 |
| --- | --- |
| `JobProfile` | 岗位职责、技能、工具、关键词和评估标准 |
| `AbilityProfile` | 用户教育、经历、技能、优势、差距与匹配度 |
| `GapReport` | 已匹配技能、缺失技能、风险、优先差距与行动建议 |
| `Roadmap` | 阶段目标、周目标、每日任务、项目、资源和验收标准 |
| `ProjectRecommendation` | 三档项目建议、训练能力、功能、交付物和面试讲法 |
| `ResumeReport` | 简历匹配度、缺失关键词、项目经历草稿与优化建议 |
| `InterviewReport` | 面试题、评分、反馈、优化答案和练习建议 |
| `AgentTask` | 学习、项目和面试任务及其优先级、状态和时间信息 |
| `AgentState` | 串联目标岗位、用户资料、各阶段报告和任务的统一状态 |

所有业务数据目前仅保存在当前浏览器中，不会同步到其他设备。

## AI 能力与规则能力

### 使用 LLM 的能力

- 岗位画像生成
- 用户能力画像分析
- 项目推荐
- 简历优化报告
- 模拟面试题生成
- 面试回答评分与优化
- PDF 全文知识库问答

AI 请求通过统一的 server function 入口发送到 SiliconFlow，并要求模型返回结构化 JSON 或文本结果。项目会对部分结构化结果做解析和标准化，但当前不具备生产级模型评测、可观测性或内容审核体系。

### 使用本地规则的能力

- 岗位画像与能力画像的 Gap 对比
- 90 天阶段化 Roadmap 生成
- 从路线、项目与面试建议生成 Tasks
- 任务状态合并与完成率统计
- Dashboard / Profile 指标和下一步动作推导

### fallback 机制

项目推荐、简历报告、模拟面试题和面试回答评分具备本地 fallback。外部模型请求失败或返回结果无法解析时，系统可以使用规则生成的基础结果维持核心演示链路。

岗位画像和能力画像目前仍依赖有效的 AI 请求；因此 fallback 是部分覆盖，不应描述为完全离线可用。

## PDF 与 RAG 原型说明

当前 RAG 功能是 **PDF 全文知识库问答原型**，不是完整的向量数据库 RAG：

1. 浏览器使用 PDF.js 提取 PDF 全文。
2. 提取结果保存在当前浏览器的 `localStorage`。
3. 用户提问时，将全文和问题一起提交给模型。
4. 模型根据提供的全文上下文生成回答。

当前未实现：

- 文档分块
- Embedding
- 向量数据库
- 语义召回或混合检索
- 重排序
- 引用来源和页码溯源
- 多文档知识库管理

因此该功能用于验证知识库问答交互和调用链路，不适合大规模文档或生产环境。

## API Key 安全整改

项目已将 SiliconFlow 和 Tavily 的调用从浏览器侧迁移到 TanStack Start server functions 与 `.server.ts` 服务端模块：

- 浏览器只调用受控的 server function
- API Key 通过服务端 `process.env` 读取
- 客户端代码不直接读取或保存密钥
- `.env` 不进入 Git 跟踪
- 仓库仅保留不含真实密钥的 `.env.example`
- Tavily 返回数据会被转换为仅包含标题、摘要和 URL 的安全字段

该整改解决了私密 API Key 被打包到客户端的风险，但生产环境仍需要补充：

- 用户身份认证与权限控制
- API 调用限流和配额
- 日志审计与异常监控
- 密钥轮换
- 服务端输入长度和文件大小限制
- 内容安全与隐私治理

## 本地运行

### 环境要求

- Node.js 20 或更高版本
- npm

### 安装依赖

```bash
npm install
```

### 配置环境变量

Windows PowerShell：

```powershell
Copy-Item .env.example .env
```

macOS / Linux：

```bash
cp .env.example .env
```

在 `.env` 中填写：

```dotenv
SILICONFLOW_API_KEY=
TAVILY_API_KEY=
```

- `SILICONFLOW_API_KEY`：用于 AI 分析、生成和知识库问答
- `TAVILY_API_KEY`：用于岗位搜索

不要使用 `VITE_` 前缀保存私密 Key。带有该前缀的变量可能被注入客户端代码。

### 启动开发环境

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

## Demo 演示路线

推荐使用一套提前准备好的完整本地数据，在 3 分钟内展示：

1. 首页：说明目标岗位和当前主链路进度
2. JD 上传与岗位分析：展示真实输入如何转化为结构化岗位画像
3. 能力评估与 Gap：展示个性化差距诊断
4. Roadmap 与 Projects：展示从差距到学习和作品集行动
5. Resume 与 Interview：展示求职材料和面试准备
6. Tasks：展示建议如何转化为可执行任务
7. Dashboard / Profile：展示任务与主链路形成进度反馈闭环

完整时间轴、点击路径和讲解重点见 [3 分钟 Demo 演示稿](docs/demo-script.md)。

## 当前限制

- 当前项目是 MVP / prototype，不是正式商业产品
- 数据仅存储在当前浏览器的 `localStorage`
- 没有登录、注册或用户账号系统
- 没有真实数据库
- 没有云端备份和多设备同步
- 清理浏览器数据可能导致项目数据丢失
- AI 输出可能存在不准确或格式异常，不能替代专业职业咨询
- Tavily 搜索结果仅用于原型展示，不能作为正式招聘或薪酬决策依据
- RAG 是 PDF 全文上下文问答原型，不是向量数据库 RAG
- 目前没有生产级限流、审计、监控和内容安全体系
- 尚未完成系统性的真实用户效果验证

## 后续规划

### 近期原型完善

- 增加 localStorage 数据导入、导出和版本迁移
- 完善关键页面的组件测试与端到端演示验证
- 细化 Dashboard 指标定义和阶段完成标准
- 增加更清晰的错误状态和数据重置说明

### 产品验证后

- 通过真实用户访谈验证 Workflow 是否提高求职准备效率
- 根据使用数据调整节点顺序、输入成本和报告结构
- 评估登录、数据库、云端同步和多目标岗位管理
- 将 PDF 问答升级为支持分块、Embedding、检索和引用的 RAG

### 生产化前

- 加入认证、权限、限流、审计和可观测性
- 建立模型输出评测、Prompt 版本管理和异常降级机制
- 完善隐私政策、用户数据删除和敏感信息保护

当前阶段不计划扩展 Offers 管理、登录系统或真实数据库，优先保持主 Workflow 的可演示性和可验证性。
