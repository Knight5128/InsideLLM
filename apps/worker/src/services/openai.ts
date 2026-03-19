export function getOpenAiTokenizerMeta() {
  return {
    supportedEncodings: ['cl100k_base', 'o200k_base'],
    note: 'OpenAI tokenizer 对比在前端通过本地 js-tiktoken 实现，无需远程代理。',
  }
}
