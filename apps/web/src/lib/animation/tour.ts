export interface GuidedStep {
  id: string
  title: string
  description: string
}

export const guidedSteps: GuidedStep[] = [
  {
    id: 'text',
    title: '文本只是起点',
    description: '用户先输入一段文字，模型暂时只看到字符序列。',
  },
  {
    id: 'token',
    title: 'Tokenizer 切分文本',
    description: '不同 tokenizer 会把同一句中文切成不同数量的 token。',
  },
  {
    id: 'embedding',
    title: 'Token 映射到向量',
    description: '每个 token 会先查表拿到初始 embedding，再进入上下文化阶段。',
  },
  {
    id: 'transformer',
    title: 'Transformer 加入上下文',
    description: '注意力与 MLP 让 token 的语义位置根据上下文发生漂移。',
  },
  {
    id: 'evolution',
    title: '模型代际不断演化',
    description: '新的 encoding、embedding 模型和能力路线一起改变最终体验。',
  },
]
