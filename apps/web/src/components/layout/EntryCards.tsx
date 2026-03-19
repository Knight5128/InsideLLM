import { ArrowRight, Box, History, ScanSearch } from 'lucide-react'
import { Link } from 'react-router-dom'

import { Card } from '@/components/ui/card'

const entries = [
  {
    to: '/architecture',
    title: '认识大模型内部结构',
    body: '进入 3D 展厅，看见 tokenizer、embedding、Transformer block 和输出头之间的空间关系。',
    icon: Box,
  },
  {
    to: '/token-lab',
    title: '观察文本如何变成 token 和向量',
    body: '输入一句中文，实时对比不同 encoding 的 token 数、token IDs 与向量链路。',
    icon: ScanSearch,
  },
  {
    to: '/timeline',
    title: '浏览主流模型的演化路线',
    body: '按厂商查看 tokenizer、embedding 与整体能力是如何逐步变化的。',
    icon: History,
  },
]

export function EntryCards() {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {entries.map((entry) => {
        const Icon = entry.icon
        return (
          <Link key={entry.to} to={entry.to}>
            <Card className="h-full space-y-4 transition hover:-translate-y-1 hover:border-cyan-300/70">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-100 text-cyan-700">
                <Icon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-slate-900">{entry.title}</h3>
              </div>
              <div className="flex items-center gap-2 text-sm text-cyan-700">
                进入模块
                <ArrowRight className="h-4 w-4" />
              </div>
            </Card>
          </Link>
        )
      })}
    </div>
  )
}
