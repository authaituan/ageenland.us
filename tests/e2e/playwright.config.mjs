// Kiểm thử E2E Phase CMS. Chạy: npm run test:e2e (lần đầu: npm run test:e2e:install)
import os from 'os';
import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from '@playwright/test';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const PORT = Number(process.env.E2E_PORT || 5460);
// Mật khẩu chỉ dùng cho DB tạm của bài kiểm thử, không phải tài khoản thật.
process.env.E2E_ADMIN_PASSWORD ||= 'e2e-only-Passw0rd';

export default defineConfig({
  testDir: '.',
  outputDir: path.join(os.tmpdir(), 'greenland-e2e-results'), // không tạo rác trong repo
  reporter: 'list',
  workers: 1,
  timeout: 60_000,
  use: { baseURL: `http://localhost:${PORT}` },
  webServer: {
    command: 'node tests/e2e/server.cjs',
    cwd: ROOT,
    url: `http://localhost:${PORT}/api/site`,
    reuseExistingServer: false,
    timeout: 60_000,
    env: { PORT: String(PORT), E2E_ADMIN_PASSWORD: process.env.E2E_ADMIN_PASSWORD },
  },
});
