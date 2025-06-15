import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
export default defineConfig({
  darkMode: 'class',
  server:{
    proxy:{
      '/api':'http://localhost:8000'
    }
  },
  plugins: [
    tailwindcss(),
  ],
})


