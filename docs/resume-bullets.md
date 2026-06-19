# 简历项目经历草稿

使用时请根据目标岗位、简历版面和实际负责范围调整措辞。不要补充未验证的用户量、转化率、准确率、性能提升比例或商业结果。

## 版本 A：AI 产品经理

**职途 Agent｜AI 求职成长 Workflow MVP｜独立设计与实现**

- 独立完成 AI 求职成长产品从需求分析、Workflow 设计到可运行原型实现，围绕目标岗位串联岗位画像、能力画像、Gap 诊断、Roadmap、项目推荐、简历优化、模拟面试与 Tasks 执行中心。
- 设计统一的结构化数据链路，使 `JobProfile`、`AbilityProfile`、`GapReport` 等前序结果持续作为后续节点输入，减少重复填写并保持岗位目标、项目建议和面试内容的一致性。
- 采用“LLM 生成 + 确定性规则”组合方案：使用模型处理 JD 理解、能力分析和内容生成，使用本地规则完成 Gap、Roadmap、任务生成及 Dashboard 进度反馈，提高核心链路的稳定性和可解释性。
- 将学习路线、项目交付物和面试练习建议自动转换为可跟踪 Tasks，并通过 Dashboard / Profile 汇总真实任务状态、阶段进度和下一步动作，形成从分析到执行反馈的闭环。
- 为项目推荐、简历报告和面试模块设计 fallback，在外部模型失败或结构化结果异常时提供基础规则结果；同时明确当前 MVP 的能力边界和人工判断需求。
- 完成 SiliconFlow 与 Tavily 调用的 server function 安全整改，将 API Key 从客户端迁移至服务端环境变量，并补充核心逻辑测试、构建验证和作品集文档。

## 版本 B：前端 / 全栈实习

**职途 Agent｜React + TanStack Start AI 应用原型｜独立开发**

- 使用 React 19、TypeScript、TanStack Router / Start 和 Tailwind CSS 独立实现移动端求职成长应用，完成岗位分析、能力评估、Gap、Roadmap、Projects、Resume、Interview、Tasks、Dashboard 和 Profile 等页面链路。
- 设计集中式 `AgentState` 与 `localStorage` 持久化方案，统一管理用户资料、JD、结构化 AI 报告和任务状态，并从真实状态派生 Dashboard / Profile 指标和下一步导航。
- 基于 TanStack Start server functions 封装 SiliconFlow LLM 与 Tavily Search 调用，通过 Zod 校验服务端输入、`.server.ts` 隔离外部 API，并避免私密 Key 进入客户端构建产物。
- 实现结构化 AI 调用链，覆盖 JobProfile、AbilityProfile、项目推荐、简历报告、模拟面试和回答评分；对模型 JSON 结果进行解析与标准化，并为部分模块提供本地 fallback。
- 实现 PDF.js 浏览器端文本提取与 PDF 全文知识库问答原型；准确控制技术范围，当前未使用 Embedding、向量数据库或检索召回。
- 为 Tasks、Dashboard、AI fallback 和安全迁移逻辑补充单元测试，并通过生产构建验证项目可运行性。

## 使用建议

- AI 产品经理岗位优先使用版本 A，突出用户问题、Workflow、产品取舍和反馈闭环。
- 前端或全栈岗位优先使用版本 B，突出状态管理、server function、安全边界、结构化 AI 调用和测试。
- 如果简历空间有限，保留 4 条：完整 Workflow、结构化状态、server function 安全整改、Tasks 与 Dashboard 闭环。
- 面试时应补充说明项目是 MVP，当前使用 `localStorage`，没有登录、真实数据库和多设备同步。
