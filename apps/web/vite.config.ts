import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import fs from 'node:fs'
import path from 'node:path'
import { parse } from 'yaml'

const workspaceRoot = path.resolve(__dirname, '../..')

function loadPublicConfig() {
  const activePath = path.resolve(workspaceRoot, 'conf.yaml')
  const backupPath = path.resolve(workspaceRoot, 'conf.yaml.backup')
  const configPath = fs.existsSync(activePath) ? activePath : backupPath
  const raw = fs.readFileSync(configPath, 'utf8')
  const parsed = parse(raw) as {
    public?: {
      workerBaseUrl?: string
      enableRealApiLab?: boolean
      defaults?: {
        googleModel?: string
        anthropicModel?: string
      }
    }
  }

  return {
    workerBaseUrl: parsed.public?.workerBaseUrl ?? 'http://127.0.0.1:8787',
    enableRealApiLab: parsed.public?.enableRealApiLab ?? true,
    defaults: {
      googleModel: parsed.public?.defaults?.googleModel ?? 'gemini-2.5-flash',
      anthropicModel:
        parsed.public?.defaults?.anthropicModel ?? 'claude-3-5-sonnet-latest',
    },
  }
}

const publicConfig = loadPublicConfig()

export default defineConfig({
  plugins: [react(), tailwindcss()],
  define: {
    __INSIDELLM_PUBLIC_CONFIG__: JSON.stringify(publicConfig),
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
