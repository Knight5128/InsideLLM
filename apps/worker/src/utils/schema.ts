export interface Env {
  APP_NAME: string
  GEMINI_API_KEY?: string
  ANTHROPIC_API_KEY?: string
}

export interface TokenCountRequest {
  vendor: 'google' | 'anthropic'
  model: string
  text: string
}

export interface TokenListRequest {
  vendor: 'google'
  model: string
  text: string
}
