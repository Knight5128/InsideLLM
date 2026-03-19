import { useState } from 'react'

import sampleTexts from '@/content/samples/token-samples.json'
import { TokenBreakdownPanel } from '@/components/labs/TokenBreakdownPanel'
import { VendorApiPanel } from '@/components/labs/VendorApiPanel'
import { VectorChainPanel } from '@/components/labs/VectorChainPanel'
import { Card } from '@/components/ui/card'

export function TokenLabPage() {
  const [text, setText] = useState(sampleTexts[0].text)

  return (
    <div className="space-y-6">
      <Card className="space-y-4">
        <h1 className="text-4xl font-semibold text-slate-900">从文本到 token，再到向量</h1>
      </Card>

      <TokenBreakdownPanel onTextChange={setText} text={text} />
      <VectorChainPanel text={text} />
      <VendorApiPanel text={text} />
    </div>
  )
}
