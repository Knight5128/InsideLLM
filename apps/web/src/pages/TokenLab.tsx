import { useState } from 'react'

import sampleTexts from '@/content/samples/token-samples.json'
import { TokenBreakdownPanel } from '@/components/labs/TokenBreakdownPanel'
import { VendorApiPanel } from '@/components/labs/VendorApiPanel'
import { VectorChainPanel } from '@/components/labs/VectorChainPanel'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'

export function TokenLabPage() {
  const [text, setText] = useState(sampleTexts[0].text)

  return (
    <div className="space-y-6">
      <Card className="space-y-4">
        <Badge>核心实验台</Badge>
        <h1 className="text-4xl font-semibold text-white">从文本到 token，再到向量</h1>
        <p className="max-w-4xl text-sm leading-7 text-slate-300">
          这是全站最核心的互动区。你输入一句话后，可以直接比较不同 encoding 的 token 结果，
          再看这些 token 如何被映射成向量，并在上下文里发生语义漂移。
        </p>
      </Card>

      <TokenBreakdownPanel onTextChange={setText} text={text} />
      <VectorChainPanel text={text} />
      <VendorApiPanel text={text} />
    </div>
  )
}
