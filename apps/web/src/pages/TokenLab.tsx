import { useState } from 'react'

import sampleTexts from '@/content/samples/token-samples.json'
import { Card } from '@/components/ui/card'
import { TokenizerPlaygroundEmbed } from '../components/labs/TokenizerPlaygroundEmbed'

export function TokenLabPage() {
  const [text, setText] = useState(sampleTexts[0].text)
  const [tokenizerId, setTokenizerId] = useState('Xenova/gpt-4')

  return (
    <div className="space-y-6">
      <Card className="space-y-4">
        <div className="space-y-3">
          <h1 className="text-4xl font-semibold text-slate-900">Token 实验室</h1>
          <p className="max-w-3xl text-sm leading-6 text-slate-600">
            基于 HuggingFace 的 tokenizer playground，观察同一段文本在不同模型分词器下的切分方式、token id 与解码结果。
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
