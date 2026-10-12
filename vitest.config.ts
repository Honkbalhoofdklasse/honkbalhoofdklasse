import path from 'node:path'
import { defineConfig } from 'vitest/config'

const alias = { '@': path.resolve(__dirname, 'src') }

export default defineConfig({
  resolve: { alias },
  test: {
    projects: [
      {
        resolve: { alias },
        test: { name: 'node', include: ['src/**/*.test.ts'], environment: 'node' },
      },
      {
        resolve: { alias },
        test: { name: 'dom', include: ['src/**/*.test.tsx'], environment: 'jsdom' },
      },
    ],
  },
})
