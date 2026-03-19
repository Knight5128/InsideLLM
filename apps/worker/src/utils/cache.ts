const memoryCache = new Map<string, { value: unknown; expiresAt: number }>()

export function getCached<T>(key: string) {
  const hit = memoryCache.get(key)
  if (!hit || hit.expiresAt < Date.now()) {
    memoryCache.delete(key)
    return null
  }

  return hit.value as T
}

export function setCached(key: string, value: unknown, ttlMs = 60_000) {
  memoryCache.set(key, {
    value,
    expiresAt: Date.now() + ttlMs,
  })
}
