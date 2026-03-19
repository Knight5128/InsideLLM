# InsideLLM

InsideLLM 是一个面向非技术用户的可交互科普网站，用 3D 可视化、时间轴、实验台和动画演示，帮助用户理解大模型内部是如何处理文本的，重点聚焦以下三条主线：

- 大模型内部通用结构：`文本 -> token -> 向量 -> Transformer -> 输出`
- embedding 的训练逻辑：训练前混乱、训练中聚拢、训练后形成语义空间
- 主流模型生态演化：OpenAI、Gemini、Claude 等厂商在 tokenizer、embedding 与整体能力上的代际变化

## 项目定位

这个项目不是对某家闭源模型做论文级复刻，而是把公开可验证的信息与教学化抽象演示结合起来，让用户快速建立直觉：

- 看见 token 是怎么切出来的
- 看见 token 如何映射到向量
- 看见上下文化后向量如何发生变化
- 看见不同代际 tokenizer 为什么会带来不同的 token 体验
- 看见 embedding 为什么能支撑检索、聚类、推荐和语义比较

## 核心体验

### 1. 首页导览

首页通过自动播放的可视化导览，快速建立“文本进入模型内部后会发生什么”的整体印象。用户可以从首页进入三条核心路径：结构展厅、Token 实验室、模型演化时间轴。

### 2. 3D 架构展厅

通过 3D 场景展示大模型的通用内部结构，包括：

- Input Text
- Tokenizer
- Token IDs
- Token Embedding
- Positional Information
- Transformer Blocks
- Attention / MLP / Residual / LayerNorm
- Output Head

支持点击组件查看说明，并提供初级视图与高级视图切换。在弱设备或关闭动效时，会自动降级为 2D 解释视图。

### 3. Token 实验室

这是项目的核心互动区域。用户可以输入中文、英文、中英混合文本、emoji 或代码片段，实时观察：

- 文本如何被切分成 token
- token 数、字符数、字符/token 比值
- `cl100k_base` 与 `o200k_base` 的并排对比
- 不同 tokenizer 对中文切分粒度与 token 效率的影响
- token 如何进一步映射到 embedding 向量

当前 OpenAI tokenizer 对比使用本地 tokenizer 逻辑完成，Gemini / Anthropic 的 token counting 与 token listing 通过 Worker 代理层预留了接入路径。

### 4. Embedding 训练可视化

项目通过“语义磁场”式动画解释 embedding 是如何被训练出来的：

- 训练前：样本点分布混乱
- 训练中：相近样本逐渐靠近
- 训练后：主题簇形成，语义空间稳定

同时配合简化训练流程说明：

- 采样 batch
- 前向传播
- 计算 loss
- 反向更新
- 评估收敛

这一部分明确属于教学抽象，不声称复现某家厂商完整公开的真实训练流水线。

### 5. 模型演化时间轴

时间轴按厂商组织，帮助用户理解代际变化的连续性。当前内容重点覆盖：

- OpenAI：`cl100k_base -> o200k_base`，以及 `text-embedding-ada-002 -> text-embedding-3-small / large`
- Google Gemini：token counting / token listing 能力与 embedding 路线
- Anthropic Claude：token counting 能力与 embedding 生态说明

项目特别强调一个重要认知：不同 tokenizer 会直接改变用户对 token 成本、切分粒度和多语言效率的体感。更合适的表达不是“某一代模型一定字符数大于 token 数”或“小于 token 数”，而是：

不同代际 tokenizer 对中文等非英文文本的切分策略不同，因此字符/token 比值会随着编码方案变化而显著变化。

## 技术栈

- React 19
- TypeScript
- Vite
- Tailwind CSS v4
- shadcn 风格 UI 组件
- React Router v7
- React Three Fiber + drei
- Framer Motion
- Zustand
- D3.js
- Cloudflare Workers
- pnpm workspace monorepo

## 项目结构

```text
InsideLLM/
  apps/
    web/        # 前端站点
    worker/     # Cloudflare Worker API 代理
  packages/
    shared/     # 共享类型、常量、厂商元数据
  docs/         # 辅助开发文档（默认不纳入版本控制）
```

## 本地开发

### 环境要求

- Node.js 22+
- Corepack
- pnpm

### 安装依赖

```bash
corepack pnpm install
```

### 启动前端

```bash
corepack pnpm dev:web
```

### 启动 Worker

```bash
corepack pnpm dev:worker
```

### 质量检查

```bash
corepack pnpm lint
corepack pnpm check
corepack pnpm build
```

## Worker 环境变量

如果需要真正接通第三方 token API，需要在 Worker 环境中配置：

- `GEMINI_API_KEY`
- `ANTHROPIC_API_KEY`

前端不会直接暴露这些密钥，所有第三方请求都应通过 Worker 代理。

## 设计原则

- 面向非技术用户，优先保证“能看懂”
- 所有复杂概念尽量可视化
- 明确区分“公开事实”和“教学抽象”
- 优先支持中文场景下的 token 体验比较
- 兼顾性能、移动端适配和弱设备降级

## 当前版本说明

当前版本已经具备完整前端骨架和核心展示路径，适合作为第一版产品原型与后续扩展基础。后续可继续扩展：

- 多模态 embedding 可视化
- RAG / 向量数据库检索动画
- 更多厂商与开源模型时间线
- 更真实的在线 token 统计与 API 联调
