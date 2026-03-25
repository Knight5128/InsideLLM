import { ModelEvolutionTimeline } from '@/components/timeline/ModelEvolutionTimeline'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

const hierarchyCards = [
  {
    id: 'word',
    title: 'Word-based',
    subtitle: '按词切分',
    body: '最符合人的直觉，但词表容易迅速膨胀，低频词与词形变化会带来明显的 OOV 压力。',
    examples: [
      {
        label: 'EXAMPLE - EN',
        source: 'tokenizers help language models read text efficiently',
        tokens: ['tokenizers', 'help', 'language', 'models', 'read', 'text', 'efficiently'],
      },
      {
        label: 'EXAMPLE - ZH',
        source: '分词器帮助语言模型更高效地理解文本',
        tokens: ['分词器', '帮助', '语言模型', '更高效地', '理解', '文本'],
      },
      {
        label: 'EXAMPLE - JP',
        source: 'トークナイザーは言語モデルが文章を効率よく読むのを助ける',
        tokens: ['トークナイザー', 'は', '言語モデル', 'が', '文章', 'を', '効率よく', '読む', 'のを', '助ける'],
      },
    ],
    tone: 'border-amber-200/80 bg-amber-50/70 text-amber-900',
  },
  {
    id: 'character',
    title: 'Character-based',
    subtitle: '按字符切分',
    body: '词表很小、覆盖强，但序列会变长，语义颗粒度过细，训练和推理成本通常更高。',
    examples: [
      {
        label: 'EXAMPLE - EN',
        source: 'tokenizers help language models',
        tokens: ['t', 'o', 'k', 'e', 'n', 'i', 'z', 'e', 'r', 's', '[space]', 'h', 'e', 'l', 'p', '[space]', 'l', 'a', 'n', 'g', 'u', 'a', 'g', 'e', '[space]', 'm', 'o', 'd', 'e', 'l', 's'],
      },
      {
        label: 'EXAMPLE - ZH',
        source: '分词器帮助语言模型理解文本',
        tokens: ['分', '词', '器', '帮', '助', '语', '言', '模', '型', '理', '解', '文', '本'],
      },
      {
        label: 'EXAMPLE - JP',
        source: 'トークナイザーが文章を理解する',
        tokens: ['ト', 'ー', 'ク', 'ナ', 'イ', 'ザ', 'ー', 'が', '文', '章', 'を', '理', '解', 'す', 'る'],
      },
    ],
    tone: 'border-violet-200/80 bg-violet-50/70 text-violet-900',
  },
  {
    id: 'subword',
    title: 'Subword',
    subtitle: '按子词切分',
    body: '现代 Transformer / LLM 的主流方案，在词表大小与语义表达能力之间取得更好的平衡。',
    examples: [
      {
        label: 'EXAMPLE - EN',
        source: 'tokenizers help language models read efficiently',
        tokens: ['token', 'izers', 'help', 'language', 'model', 's', 'read', 'efficient', 'ly'],
      },
      {
        label: 'EXAMPLE - ZH',
        source: '分词器帮助语言模型更高效地理解文本',
        tokens: ['分词', '器', '帮助', '语言', '模型', '更', '高效', '地', '理解', '文本'],
      },
      {
        label: 'EXAMPLE - JP',
        source: 'トークナイザーは文章理解を助ける',
        tokens: ['トーク', 'ナイザー', 'は', '文章', '理解', 'を', '助け', 'る'],
      },
    ],
    tone: 'border-cyan-200/80 bg-cyan-50/80 text-cyan-950',
  },
] as const

const familyCards = [
  {
    id: 'bpe',
    title: 'BPE',
    kicker: '高频合并路线',
    body: '从更小单位开始，反复合并最常一起出现的相邻片段，是当前最常见的 tokenizer 家族之一。',
  },
  {
    id: 'byte-bpe',
    title: 'Byte-level BPE',
    kicker: 'BPE 的工程强化版',
    body: '把 256 个字节作为基础词表，更适合覆盖任意输入并避免 <unk>，GPT 系列影响最大。',
  },
  {
    id: 'wordpiece',
    title: 'WordPiece',
    kicker: 'BERT 时代代表方案',
    body: '和 BPE 类似，但更强调“哪一次合并最有信息量”，是 Google/BERT 路线的关键方案。',
  },
  {
    id: 'unigram',
    title: 'Unigram',
    kicker: '概率式子词选择',
    body: '先保留大量候选子词，再逐步删除贡献较低的 token，最终保留更优词表。',
  },
  {
    id: 'sentencepiece',
    title: 'SentencePiece',
    kicker: '直接处理原始文本',
    body: '更像一个训练框架而非单一算法，可以在原始文本上训练 BPE 或 Unigram，特别适合多语言。',
  },
] as const

const quickFacts = [
  '先看“层级关系”，再看“厂商时间线”',
  '同层比较算法，不跨层比较概念',
  'SentencePiece 更接近框架，BPE / Unigram 更接近算法',
] as const

export function TimelinePage() {
  return (
    <div className="space-y-8 pb-6">
      

      <section className="space-y-5" id="timeline-hierarchy">
        <div className="space-y-3">
          <Badge className="w-fit">Hierarchy</Badge>
          <h2 className="text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
            Tokenizer 的三层关系
          </h2>
          <p className="max-w-3xl text-sm leading-7 text-slate-600 md:text-base">
            `Word-based`、`Character-based`、`Subword` 是三种切分粒度；而 `BPE`、`WordPiece`、
            `Unigram` 则是 `Subword` 路线下的具体方案。
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {hierarchyCards.map((item) => (
            <Card
              key={item.id}
              className={`space-y-3 rounded-[2rem] border ${item.tone} bg-[linear-gradient(180deg,rgba(255,255,255,0.86),rgba(255,255,255,0.74))]`}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.22em] opacity-70">{item.subtitle}</p>
              <h3 className="text-2xl font-semibold">{item.title}</h3>
              <p className="text-sm leading-7 opacity-90">{item.body}</p>
              <div className="space-y-3 rounded-2xl bg-white/55 p-4">
                {item.examples.map((example) => (
                  <div key={`${item.id}-${example.label}`} className="space-y-2">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] opacity-60">
                      {example.label}
                    </p>
                    <p className="font-mono text-xs opacity-80">{example.source}</p>
                    <div className="flex flex-wrap gap-2">
                      {example.tokens.map((token, index) => (
                        <span
                          key={`${item.id}-${example.label}-${index}-${token}`}
                          className="rounded-full border border-current/15 bg-white/70 px-2.5 py-1 font-mono text-xs"
                        >
                          {token}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section className="space-y-5" id="timeline-families">
        <div className="space-y-3">
          <Badge className="w-fit">Trending</Badge>
          <h2 className="text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
            主流 Subword Tokenizers
          </h2>
          <p className="max-w-3xl text-sm leading-7 text-slate-600 md:text-base">
    
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {familyCards.map((item) => (
            <Card
              key={item.id}
              className="group flex h-full flex-col justify-between rounded-[2rem] border border-white/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.9),rgba(248,250,252,0.76))] transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_44px_rgba(15,23,42,0.10)]"
            >
              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">{item.kicker}</p>
                <h3 className="text-xl font-semibold text-slate-900">{item.title}</h3>
                <p className="text-sm leading-7 text-slate-600">{item.body}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section className="space-y-5" id="timeline-vendors">
        <div className="space-y-3">
          {/*<Badge className="w-fit">Timeline</Badge>
          <h2 className="text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
            厂商 / 模型分词器时间线
          </h2>
          <p className="max-w-3xl text-sm leading-7 text-slate-600 md:text-base">
            下面按时间顺序展示不同厂商在实际模型中采用了什么 tokenizer、词表大致处于什么量级，以及每一代相对上一代的变化。
          </p>*/}
        </div>

        <ModelEvolutionTimeline />
      </section>
    </div>
  )
}
