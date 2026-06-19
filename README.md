# 职途 Agent

职途 Agent 是一个面向求职准备场景的 AI 职业成长应用原型。它围绕目标岗位，将岗位分析、能力评估、差距诊断、学习规划、项目实践、简历优化、模拟面试和执行任务串联为一条可演示的 Agent Workflow。

## 项目定位

本项目重点验证两个问题：

1. 如何把分散的求职准备步骤组织成连续、可追踪的工作流。
2. 如何让 AI 输出结构化结果，并将前序结果继续用于后续分析和行动建议。

它适合作为 AI 产品、产品工程和 Agent Workflow 设计方向的作品集项目。当前版本是本地运行的产品原型，不是完整的商业化招聘平台。

## 目标用户

- 正在准备求职或转岗的学生和初级职场人
- 希望进入 AI 产品经理、产品经理、数据分析或技术岗位的用户
- 需要将岗位要求转化为学习与作品集行动的求职者

## 用户痛点

- JD 信息复杂，不清楚岗位真正关注哪些能力
- 不知道个人能力与目标岗位之间的具体差距
- 学习内容、项目实践、简历和面试准备彼此割裂
- 有大量建议，但缺少明确的下一步执行任务
- 项目经历难以转化为简历表达和面试讲法

## 核心功能

- 目标岗位与目标公司设置
- JD 文本或 PDF 上传与岗位画像生成
- 用户能力画像与岗位匹配分析
- 能力差距报告与优先补齐项
- 阶段化学习路线
- 面向能力短板的项目推荐
- 简历匹配度和内容优化建议
- 岗位相关的模拟面试与回答评分
- 从学习路线、项目交付物和面试建议生成 Tasks
- Dashboard 与成长档案数据汇总
- PDF 知识库问答原型

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
```

每个阶段优先复用前序结构化数据。例如，项目推荐会参考岗位画像和能力差距；简历优化会继续使用项目推荐；模拟面试会结合目标岗位、简历和项目经历。

## 技术架构

- React 19 + TypeScript
- TanStack Router / TanStack Start
- Vite
- Tailwind CSS 4
- localStorage 本地状态持久化
- TanStack Start server functions
- SiliconFlow OpenAI 兼容接口，用于结构化 AI 生成
- Tavily API，用于岗位搜索
- PDF.js，用于浏览器端 PDF 文本提取
- Node.js Test Runner，用于核心逻辑测试

项目状态集中定义在 `src/lib/agent-store.ts`。页面通过 `loadState` 和 `saveState` 读写本地数据；AI 与搜索请求通过 server function 转发到服务端模块。

## 当前已完成能力

- 完整求职准备主链路
- 关键报告的结构化类型与本地持久化
- AI 调用失败时的部分本地回退方案
- 学习、项目和面试任务的自动生成及状态管理
- Dashboard 真实进度与下一步动作推荐
- Profile 真实成长指标汇总
- API Key 服务端隔离
- 核心 AI、任务和安全逻辑测试

当前限制：

- 数据仅存储在当前浏览器的 `localStorage` 中
- 尚未接入真实数据库
- 尚未接入登录、用户账号和多设备同步
- 当前 RAG 是 PDF 知识库问答原型：PDF 文本被提取并保存在本地，再作为知识上下文提交给模型；尚未实现向量数据库、Embedding、分块召回和引用溯源
- 当前岗位、薪资和行业展示中的部分内容仍属于产品原型信息，不应作为正式求职或薪酬决策依据

## 本地运行

环境要求：

- Node.js 20 或更高版本
- npm

安装依赖：

```bash
npm install
```

复制环境变量示例：

```bash
copy .env.example .env
```

启动开发环境：

```bash
npm run dev
```

构建生产版本：

```bash
npm run build
```

## 环境变量

在项目根目录创建 `.env`：

```dotenv
SILICONFLOW_API_KEY=
TAVILY_API_KEY=
```

- `SILICONFLOW_API_KEY`：用于岗位画像、能力分析、项目推荐、简历优化、模拟面试和知识库问答。
- `TAVILY_API_KEY`：用于岗位搜索。

不要使用 `VITE_` 前缀保存私密 Key，因为带有该前缀的变量可能被注入客户端代码。

## 安全说明

API Key 通过 TanStack Start server function 和 `.server.ts` 服务端模块隔离：

- 浏览器只调用 `createServerFn` 暴露的业务操作
- 服务端通过 `process.env` 读取 Key
- 客户端代码不直接访问或保存 API Key
- `.env` 已排除在 Git 跟踪之外，仓库只保留不含真实密钥的 `.env.example`

该隔离解决了前端直接暴露 Key 的问题，但正式生产环境仍需要补充身份认证、调用限流、审计、密钥轮换和服务端输入长度限制。

## Demo 演示流程

推荐按以下顺序演示：

1. 在首页输入目标岗位和目标公司。
2. 上传或粘贴一份目标岗位 JD。
3. 展示结构化 JobProfile 岗位画像。
4. 填写个人学历、项目经验和技能，生成 AbilityProfile。
5. 查看能力匹配度、关键差距和行动建议。
6. 生成学习路线和三档项目推荐。
7. 展示简历匹配度、项目经历草稿和优化建议。
8. 完成一道模拟面试题并查看评分与优化答案。
9. 进入 Tasks 查看系统汇总的执行任务，并修改任务状态。
10. 返回 Dashboard 和成长档案，展示真实进度、任务统计和下一步推荐。

## 后续 Roadmap

后续可按实际产品验证结果逐步扩展：

- 为 localStorage 数据增加导入、导出和版本迁移
- 完善 Dashboard 指标定义和阶段完成标准
- 为关键页面补充更多组件与交互测试
- 将 PDF 问答升级为带分块、Embedding、召回和引用来源的 RAG
- 在确有多用户需求后再评估登录、数据库和云端同步
- 增加真实用户测试，验证工作流是否能提升求职准备效率

当前阶段不计划开发 Offers 管理、登录系统或数据库。
