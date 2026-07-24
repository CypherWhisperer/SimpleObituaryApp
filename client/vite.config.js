import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// to avoid the `__dirname is not defined` Classic Vite/ESM Error/issue:
// Since Vite config files run as ES modules, `__dirname` isn't available.
// Fix it by reconstructing it at the top of your `vite.config.js`:
import { fileURLToPath} from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@layoutComponents': path.resolve(__dirname, './src/components/layout/index.js'),
      '@sectionComponents': path.resolve(__dirname, './src/components/sections/index.js'),
      '@uiComponents': path.resolve(__dirname, './src/components/ui/index.js'),
      '@pages':      path.resolve(__dirname, './src/pages/index.js'),
      '@hooks':      path.resolve(__dirname, './src/assets/hooks/index.js'),
      '@icons':     path.resolve(__dirname, './src/assets/icons/index.js'),
    }
  },

  // Any fetch('/api/obituaries') from React gets forwarded to our Express server on port 3001,
  // and the browser sees it as same-origin, so no CORS package needed.
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true
      }
    }
  }
})
