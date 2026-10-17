import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
// @ts-expect-error -- plain ESM helper shared with scripts/serve-dist.mjs
import { runApiFunction } from './scripts/lib/node-api-adapter.mjs'

const root = path.dirname(fileURLToPath(import.meta.url))

// Serves /api/* serverless functions during `vite dev`, using the same adapter as the
// local production preview, so the assistant works end to end in development.
function apiFunctions(): Plugin {
  return {
    name: 'local-api-functions',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const pathname = new URL(req.url ?? '/', 'http://localhost').pathname
        if (!pathname.startsWith('/api/')) return next()
        try {
          const handled = await runApiFunction(root, pathname, req, res)
          if (!handled) next()
        } catch (error) {
          next(error)
        }
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), apiFunctions()],
  build: {
    target: 'es2020',
    manifest: true,
    assetsInlineLimit: 2048,
  },
})
