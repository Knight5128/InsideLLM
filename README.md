# InsideLLM

InsideLLM 是一个面向非技术用户的可交互科普网站，用 3D 可视化、时间轴和实验台帮助用户理解大模型内部是如何处理文本的，重点聚焦以下三条主线：

- 大模型内部通用结构：`文本 -> token -> 向量 -> Transformer -> 输出`
- 不同 tokenizer 对文本切分、token 成本与多语言效率的影响
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

- 文本在不同模型 tokenizer 下的切分方式
- token id、解码结果与分词边界
- OpenAI、Claude、Gemma、Llama 等不同 tokenizer 的并排切换体验
- 不同 tokenizer 对中文切分粒度与 token 效率的影响

当前实现直接嵌入 Xenova 的 Hugging Face `Tokenizer Playground` 构建产物，不再依赖 Google / Anthropic 的真实 API 代理。

### 4. 模型演化时间轴

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
- pnpm workspace monorepo

## 项目结构

```text
InsideLLM/
  apps/
    web/        # 前端站点
    worker/     # 预留的轻量 Worker 壳
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
- 更丰富的 tokenizer 对比和可解释可视化
