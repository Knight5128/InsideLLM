import fs from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

import { parse } from 'yaml'

const workspaceRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const confPath = path.join(workspaceRoot, 'conf.yaml')
const backupPath = path.join(workspaceRoot, 'conf.yaml.backup')
const workerVarsPath = path.join(workspaceRoot, 'apps', 'worker', '.dev.vars')

function loadConfig() {
  const sourcePath = fs.existsSync(confPath) ? confPath : backupPath
  const raw = fs.readFileSync(sourcePath, 'utf8')
  const parsed = parse(raw)

  if (!parsed?.app?.name) {
    throw new Error('conf.yaml 缺少 app.name')
  }

  return parsed
}

function normalizeSecret(value) {
  if (typeof value !== 'string') {
    return ''
  }

  if (value.startsWith('PASTE_YOUR_')) {
    return ''
  }

  return value
}

function main() {
  const config = loadConfig()
  const lines = [
    `APP_NAME=${JSON.stringify(config.app.name ?? 'InsideLLM')}`,
    `GEMINI_API_KEY=${JSON.stringify(normalizeSecret(config.worker?.apiKeys?.gemini))}`,
    `ANTHROPIC_API_KEY=${JSON.stringify(normalizeSecret(config.worker?.apiKeys?.anthropic))}`,
  ]

  fs.writeFileSync(workerVarsPath, `${lines.join('\n')}\n`, 'utf8')
  process.stdout.write(`Synced config to ${path.relative(workspaceRoot, workerVarsPath)}\n`)
}

main()
