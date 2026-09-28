import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { cloudflare } from '@cloudflare/vite-plugin'

// Một cổng duy nhất cho web + CMS + API khi phát triển (D28). Đổi bằng biến WEB_PORT nếu trùng dự án khác.
const WEB_PORT = Number(process.env.WEB_PORT || 5455)
// Thư mục dữ liệu local (D1 + R2 giả lập). Mặc định .wrangler/state; bài kiểm thử E2E dùng thư mục tạm.
const persistPath = process.env.CF_PERSIST_DIR

// https://vite.dev/config/  ·  https://developers.cloudflare.com/workers/vite-plugin/
export default defineConfig({
  plugins: [
    react(),
    cloudflare(persistPath ? { persistState: { path: persistPath } } : {}),
  ],
  server: {
    port: WEB_PORT,
    strictPort: true, // báo lỗi rõ ràng nếu cổng đã bị dự án khác dùng, không tự nhảy sang cổng khác
  },
  preview: {
    port: WEB_PORT,
    strictPort: true,
  },
})
