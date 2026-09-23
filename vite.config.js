import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Cổng mặc định của dự án (đổi được bằng biến môi trường nếu trùng với dự án khác):
//   API_PORT – cổng backend (npm run server), mặc định 5454
//   WEB_PORT – cổng website khi phát triển (npm run dev), mặc định 5455
const API_PORT = Number(process.env.API_PORT || process.env.PORT || 5454)
const WEB_PORT = Number(process.env.WEB_PORT || 5455)
const target = `http://localhost:${API_PORT}`

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
  ],
  server: {
    port: WEB_PORT,
    strictPort: true, // báo lỗi rõ ràng nếu cổng đã bị dự án khác dùng, không tự nhảy sang cổng khác
    proxy: {
      '/api': { target, changeOrigin: true },
      '/uploads': { target, changeOrigin: true },
    }
  }
})
