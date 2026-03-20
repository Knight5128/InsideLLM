export type ExhibitionModelId = 'gpt2-small' | 'nano-gpt' | 'gpt2-xl' | 'gpt3'

export type ExhibitionSectionId =
  | 'overview'
  | 'introduction'
  | 'preliminaries'
  | 'embedding'
  | 'layer-norm'
  | 'self-attention'
  | 'projection'
  | 'mlp'
  | 'transformer'
  | 'softmax'
  | 'output'

export interface ExhibitionModel {
  id: ExhibitionModelId
  name: string
  subtitle: string
  paramsLabel: string
  paramsCount: number
  layers: number
  hiddenSize: number
  heads: number
  accent: string
}

export interface ExhibitionSection {
  id: ExhibitionSectionId
  title: string
  summary: string
}

export const GPT_EXHIBITION_MODELS: ExhibitionModel[] = [
  {
    id: 'gpt2-small',
    name: 'GPT-2 (small)',
    subtitle: '经典 12 层自回归基线',
    paramsLabel: '124M',
    paramsCount: 124_000_000,
    layers: 12,
    hiddenSize: 768,
    heads: 12,
    accent: '#60a5fa',
  },
  {
    id: 'nano-gpt',
    name: 'nano-gpt',
    subtitle: '教学用极小模型',
    paramsLabel: '85K',
    paramsCount: 85_000,
    layers: 3,
    hiddenSize: 48,
    heads: 3,
    accent: '#2dd4bf',
  },
  {
    id: 'gpt2-xl',
    name: 'GPT-2 (XL)',
    subtitle: '更深更宽的 GPT-2 变体',
    paramsLabel: '1.5B',
    paramsCount: 1_500_000_000,
    layers: 48,
    hiddenSize: 1600,
    heads: 25,
    accent: '#f59e0b',
  },
  {
    id: 'gpt3',
    name: 'GPT-3',
    subtitle: '大规模 few-shot 代表',
    paramsLabel: '175B',
    paramsCount: 175_000_000_000,
    layers: 96,
    hiddenSize: 12288,
    heads: 96,
    accent: '#818cf8',
  },
]

export const GPT_EXHIBITION_SECTIONS: ExhibitionSection[] = [
  {
    id: 'overview',
    title: 'Overview',
    summary: '从整体视角观察选中模型的输入、Transformer 主干和输出头。',
  },
  {
    id: 'introduction',
    title: 'Introduction',
    summary: '快速浏览自回归 Transformer 的端到端数据流。',
  },
  {
    id: 'preliminaries',
    title: 'Preliminaries',
    summary: '先看 token、位置与单个 block 的基本空间组织方式。',
  },
  {
    id: 'embedding',
    title: 'Embedding',
    summary: '聚焦 token embedding、position embedding 与输入向量融合。',
  },
  {
    id: 'layer-norm',
    title: 'Layer Norm',
    summary: '观察 block 内部和尾部 LayerNorm 的位置与作用。',
  },
  {
    id: 'self-attention',
    title: 'Self Attention',
    summary: '聚焦 QKV 投影、注意力矩阵与上下文聚合的核心结构。',
  },
  {
    id: 'projection',
    title: 'Projection',
    summary: '查看 attention 输出如何投影回残差通道。',
  },
  {
    id: 'mlp',
    title: 'MLP',
    summary: '查看前馈网络的扩展、激活与回投影阶段。',
  },
  {
    id: 'transformer',
    title: 'Transformer',
    summary: '从整个 block 堆叠的角度理解深度扩展与参数规模。',
  },
  {
    id: 'softmax',
    title: 'Softmax',
    summary: '聚焦 logits 到概率分布的最后一步归一化。',
  },
  {
    id: 'output',
    title: 'Output',
    summary: '查看 final LayerNorm、LM Head 与输出分布的尾部结构。',
  },
]
