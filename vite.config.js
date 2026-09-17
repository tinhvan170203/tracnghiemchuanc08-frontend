import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  // Tránh lỗi thứ tự khởi tạo `styled_default` của MUI/Emotion khi Vite
  // chia dependency thành nhiều chunk ở dev mode.
  optimizeDeps: {
    include: [
      '@emotion/react',
      '@emotion/styled',
      '@mui/material',
      '@mui/material/styles/styled',
      '@mui/material/Popper',
      '@mui/material/Tooltip',
    ],
  },
  build: {
    sourcemap: false, // Đảm bảo cái này là false khi deploy, để không lộ code gốc
   
    rollupOptions: {
      output: {
        manualChunks: {
          xlsx: ['xlsx'],
          react: ['react', 'react-dom']
        }
      }
  }
  },
})
