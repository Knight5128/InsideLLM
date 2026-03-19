export const runtimeConfig = __INSIDELLM_PUBLIC_CONFIG__

export function buildWorkerUrl(pathname: string) {
  const base = runtimeConfig.workerBaseUrl?.trim()

  if (!base) {
    return pathname
  }

  return new URL(pathname, base.endsWith('/') ? base : `${base}/`).toString()
}
