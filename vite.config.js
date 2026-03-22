import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { createReadStream } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import fs from 'fs-extra'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/** Как в serverSetup.js — раздача /data/images и /images без отдельного процесса на 3001 */
function guessImageMime(filePath) {
  const ext = path.extname(filePath).toLowerCase()
  const map = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.webp': 'image/webp',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.bmp': 'image/bmp',
    '.ico': 'image/x-icon',
  }
  return map[ext] || 'application/octet-stream'
}

/** Синхронно с serverSetup.js — заглушка при отсутствии файла на диске */
const MISSING_IMAGE_PLACEHOLDER_SVG = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
  <rect fill="#e8e8e8" width="100%" height="100%"/>
  <text x="400" y="310" text-anchor="middle" fill="#666666" font-family="system-ui,sans-serif" font-size="18">Изображение отсутствует</text>
</svg>`

function sendMissingImagePlaceholder(req, res) {
  const body = MISSING_IMAGE_PLACEHOLDER_SVG
  res.setHeader('Content-Type', 'image/svg+xml; charset=utf-8')
  res.setHeader('Cache-Control', 'private, no-cache')
  if (req.method === 'HEAD') {
    res.setHeader('Content-Length', Buffer.byteLength(body, 'utf8'))
    res.end()
    return
  }
  res.end(body, 'utf8')
}

function sharedPublicAssetsMiddleware(projectRoot) {
  const projectsRoot = path.resolve(projectRoot, '..')
  let projectSubdirsCache = null

  function getProjectSubdirNames() {
    if (projectSubdirsCache) return projectSubdirsCache
    try {
      const entries = fs.readdirSync(projectsRoot, { withFileTypes: true })
      projectSubdirsCache = entries
        .filter((e) => e.isDirectory() && !e.name.startsWith('.'))
        .map((e) => e.name)
    } catch {
      projectSubdirsCache = []
    }
    return projectSubdirsCache
  }

  function collectCandidates(normalizedRel) {
    const candidates = []
    candidates.push(path.join(projectRoot, 'build', normalizedRel))
    candidates.push(path.join(projectRoot, 'public', normalizedRel))
    for (const name of getProjectSubdirNames()) {
      candidates.push(path.join(projectsRoot, name, 'public', normalizedRel))
    }
    return candidates
  }

  return function sharedPublicAssets(req, res, next) {
    if (req.method !== 'GET' && req.method !== 'HEAD') return next()
    const pathname = (req.url || '').split('?')[0] || ''
    if (!pathname.startsWith('/data/images/') && !pathname.startsWith('/images/')) return next()

    let raw = pathname.replace(/^\/+/, '')
    try {
      raw = decodeURIComponent(raw)
    } catch {
      /* оставляем raw */
    }
    const normalized = path.normalize(raw).replace(/^(\.\.(\/|\\|$))+/, '')
    if (normalized.startsWith('..') || path.isAbsolute(normalized)) return next()

    ;(async () => {
      try {
        for (const fullPath of collectCandidates(normalized)) {
          const resolved = path.resolve(fullPath)
          if (!(await fs.pathExists(resolved))) continue
          const stat = await fs.stat(resolved)
          if (!stat.isFile()) continue

          res.setHeader('Content-Type', guessImageMime(resolved))
          res.setHeader('Cache-Control', 'public, max-age=86400')
          if (req.method === 'HEAD') {
            res.end()
            return
          }
          const stream = createReadStream(resolved)
          stream.on('error', (err) => {
            if (!res.headersSent) next(err)
          })
          stream.pipe(res)
          return
        }
        sendMissingImagePlaceholder(req, res)
      } catch (err) {
        next(err)
      }
    })()
  }
}

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'shared-public-assets',
      enforce: 'pre',
      configureServer(server) {
        server.middlewares.use(sharedPublicAssetsMiddleware(__dirname))
      },
    },
  ],
  build: {
    outDir: 'build',
  },
  // Как admin-dacha: картинки в public/data/images соседних проектов — в dev отдаёт middleware выше
  // (production / npm run server по-прежнему использует Express на 3001).
})
