interface PublicRuntimeConfig {
  workerBaseUrl: string
  enableRealApiLab: boolean
  defaults: {
    googleModel: string
    anthropicModel: string
  }
}

declare const __INSIDELLM_PUBLIC_CONFIG__: PublicRuntimeConfig
