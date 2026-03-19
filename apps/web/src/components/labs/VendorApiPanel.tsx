import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'

export function VendorApiPanel() {
  return (
    <section className="grid gap-4 lg:grid-cols-3">
      <Card className="space-y-3">
        <Badge>OpenAI</Badge>
        <h3 className="text-xl font-semibold text-white">本地 tokenizer 对比</h3>
        <p className="text-sm leading-6 text-slate-300">
          `cl100k_base` 和 `o200k_base` 在前端通过 `js-tiktoken` 本地计算，因此无需远程 API。
        </p>
      </Card>
      <Card className="space-y-3">
        <Badge>Google Gemini</Badge>
        <h3 className="text-xl font-semibold text-white">Worker 代理</h3>
        <p className="text-sm leading-6 text-slate-300">
          通过 `/api/token-count` 与 `/api/token-list` 代理 Gemini 的 token counting / token listing，
          API key 仅保存在 Worker 环境变量中。
        </p>
      </Card>
      <Card className="space-y-3">
        <Badge>Anthropic Claude</Badge>
        <h3 className="text-xl font-semibold text-white">Worker 代理</h3>
        <p className="text-sm leading-6 text-slate-300">
          通过 `/api/token-count` 代理 Anthropic token counting，用于成本估算与上下文长度解释。
        </p>
      </Card>
    </section>
  )
}
