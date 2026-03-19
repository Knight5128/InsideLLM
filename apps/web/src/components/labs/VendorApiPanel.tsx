import { useMemo, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { buildWorkerUrl, runtimeConfig } from '@/lib/runtime-config'

interface VendorApiPanelProps {
  text: string
}

interface TokenCountResponse {
  vendor: string
  model: string
  tokenCount: number
  raw?: unknown
}

interface TokenListResponse {
  vendor: string
  model: string
  tokens: unknown[]
  raw?: unknown
}

async function requestJson<T>(url: string, body: object) {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  const data = (await response.json()) as T & { error?: string; detail?: string }

  if (!response.ok) {
    throw new Error(data.detail || data.error || '请求失败')
  }

  return data
}

export function VendorApiPanel({ text }: VendorApiPanelProps) {
  const [googleModel, setGoogleModel] = useState(runtimeConfig.defaults.googleModel)
  const [anthropicModel, setAnthropicModel] = useState(runtimeConfig.defaults.anthropicModel)
  const [googleCount, setGoogleCount] = useState<TokenCountResponse | null>(null)
  const [googleList, setGoogleList] = useState<TokenListResponse | null>(null)
  const [anthropicCount, setAnthropicCount] = useState<TokenCountResponse | null>(null)
  const [loadingKey, setLoadingKey] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const tokenCountUrl = useMemo(() => buildWorkerUrl('/api/token-count'), [])
  const tokenListUrl = useMemo(() => buildWorkerUrl('/api/token-list'), [])

  async function runGoogleCount() {
    setLoadingKey('google-count')
    setError(null)

    try {
      const data = await requestJson<TokenCountResponse>(tokenCountUrl, {
        vendor: 'google',
        model: googleModel,
        text,
      })
      setGoogleCount(data)
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Gemini token count 失败')
    } finally {
      setLoadingKey(null)
    }
  }

  async function runGoogleList() {
    setLoadingKey('google-list')
    setError(null)

    try {
      const data = await requestJson<TokenListResponse>(tokenListUrl, {
        vendor: 'google',
        model: googleModel,
        text,
      })
      setGoogleList(data)
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Gemini token list 失败')
    } finally {
      setLoadingKey(null)
    }
  }

  async function runAnthropicCount() {
    setLoadingKey('anthropic-count')
    setError(null)

    try {
      const data = await requestJson<TokenCountResponse>(tokenCountUrl, {
        vendor: 'anthropic',
        model: anthropicModel,
        text,
      })
      setAnthropicCount(data)
    } catch (requestError) {
      setError(
        requestError instanceof Error ? requestError.message : 'Anthropic token count 失败',
      )
    } finally {
      setLoadingKey(null)
    }
  }

  if (!runtimeConfig.enableRealApiLab) {
    return (
      <Card className="space-y-3">
        <h2 className="text-2xl font-semibold text-slate-900">真实 API 实验区已关闭</h2>
        <p className="text-sm leading-6 text-slate-600">在 `conf.yaml` 中将 `public.enableRealApiLab` 设为 `true` 可重新启用。</p>
      </Card>
    )
  }

  return (
    <section className="space-y-4">
      <Card className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-2xl font-semibold text-slate-900">真实 API 对比</h3>
        </div>

        {error ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
            {error}
          </div>
        ) : null}

        <Tabs defaultValue="google">
          <TabsList>
            <TabsTrigger value="google">Gemini</TabsTrigger>
            <TabsTrigger value="anthropic">Anthropic</TabsTrigger>
          </TabsList>

          <TabsContent value="google" className="space-y-4">
            <div className="grid gap-4 lg:grid-cols-[1fr_auto_auto] lg:items-end">
              <label className="grid gap-2 text-sm text-slate-600">
                Gemini 模型
                <input
                  className="rounded-2xl border border-cyan-100 bg-white px-4 py-3 text-slate-900 outline-none"
                  onChange={(event) => setGoogleModel(event.target.value)}
                  value={googleModel}
                />
              </label>
              <Button onClick={runGoogleCount} type="button">
                {loadingKey === 'google-count' ? '请求中...' : '测 token 数'}
              </Button>
              <Button onClick={runGoogleList} type="button" variant="secondary">
                {loadingKey === 'google-list' ? '请求中...' : '测 token 列表'}
              </Button>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <Card className="space-y-3">
                <div className="text-lg font-semibold text-slate-900">Gemini token count</div>
                <div className="text-sm text-slate-500">
                  {googleCount ? `tokenCount = ${googleCount.tokenCount}` : '尚未发起请求'}
                </div>
                <pre className="overflow-auto rounded-2xl border border-cyan-100 bg-cyan-50/65 p-4 text-xs text-slate-600">
                  {JSON.stringify(googleCount, null, 2)}
                </pre>
              </Card>

              <Card className="space-y-3">
                <div className="text-lg font-semibold text-slate-900">Gemini token list</div>
                <div className="text-sm text-slate-500">
                  {googleList ? `tokens = ${googleList.tokens.length}` : '尚未发起请求'}
                </div>
                <pre className="overflow-auto rounded-2xl border border-cyan-100 bg-cyan-50/65 p-4 text-xs text-slate-600">
                  {JSON.stringify(googleList, null, 2)}
                </pre>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="anthropic" className="space-y-4">
            <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
              <label className="grid gap-2 text-sm text-slate-600">
                Anthropic 模型
                <input
                  className="rounded-2xl border border-cyan-100 bg-white px-4 py-3 text-slate-900 outline-none"
                  onChange={(event) => setAnthropicModel(event.target.value)}
                  value={anthropicModel}
                />
              </label>
              <Button onClick={runAnthropicCount} type="button">
                {loadingKey === 'anthropic-count' ? '请求中...' : '测 token 数'}
              </Button>
            </div>

            <Card className="space-y-3">
              <div className="text-lg font-semibold text-slate-900">Anthropic token count</div>
              <div className="text-sm text-slate-500">
                {anthropicCount ? `tokenCount = ${anthropicCount.tokenCount}` : '尚未发起请求'}
              </div>
              <pre className="overflow-auto rounded-2xl border border-cyan-100 bg-cyan-50/65 p-4 text-xs text-slate-600">
                {JSON.stringify(anthropicCount, null, 2)}
              </pre>
            </Card>
          </TabsContent>
        </Tabs>
      </Card>
    </section>
  )
}
