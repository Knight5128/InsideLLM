import { useState } from 'react'

import sampleTexts from '@/content/samples/token-samples.json'
import { TokenizerPlaygroundEmbed } from '@/components/labs/TokenizerPlaygroundEmbed'
import { Card } from '@/components/ui/card'

export function TokenLabPage() {
  const [text, setText] = useState(sampleTexts[0].text)
  const [tokenizerId, setTokenizerId] = useState('Xenova/gpt-4')

  return (
    <div className="space-y-6">
      <Card className="space-y-4">
        <div className="space-y-3">
          <h1 className="text-4xl font-semibold text-slate-900">Token 实验室</h1>
          <p className="max-w-3xl text-sm leading-6 text-slate-600">
            这里直接嵌入 Hugging Face 上的 tokenizer playground，让你对同一段文本切换不同模型词表，观察切分方式、token id 与解码结果。
          </p>
        </div>
      </Card>

      <TokenizerPlaygroundEmbed
        onTextChange={setText}
        onTokenizerChange={setTokenizerId}
        text={text}
        tokenizerId={tokenizerId}
      />
    </div>
  )
}
