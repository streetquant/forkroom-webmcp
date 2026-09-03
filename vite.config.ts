import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const securityHeaders = {
  'Origin-Agent-Cluster': '?1',
  'Permissions-Policy': 'tools=(self)',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'X-Content-Type-Options': 'nosniff',
}

export default defineConfig({
  plugins: [react()],
  server: {
    host: '127.0.0.1',
    headers: securityHeaders,
  },
  preview: {
    host: '127.0.0.1',
    headers: securityHeaders,
  },
  build: {
    target: 'es2022',
    sourcemap: true,
  },
})
