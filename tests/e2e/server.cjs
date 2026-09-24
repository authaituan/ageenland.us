// Máy chủ riêng cho kiểm thử E2E: DB + thư mục ảnh tạm, 2 admin thử, chạy bản build (production).
// Không đụng tới server/database.sqlite hay server/uploads thật.
const os = require('os');
const path = require('path');
const fs = require('fs');
const { spawnSync } = require('child_process');

const ROOT = path.join(__dirname, '..', '..');
const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'greenland-e2e-'));
process.env.DB_PATH = path.join(dir, 'database.sqlite');
process.env.UPLOAD_DIR = path.join(dir, 'uploads');

for (const username of ['admin1', 'admin2']) {
  const r = spawnSync(process.execPath, [path.join(ROOT, 'server/scripts/create-admin.cjs'), username, `E2E ${username}`], {
    env: { ...process.env, ADMIN_PASSWORD: process.env.E2E_ADMIN_PASSWORD },
    stdio: 'inherit',
  });
  if (r.status !== 0) process.exit(1);
}

const cleanup = () => fs.rmSync(dir, { recursive: true, force: true });
process.on('exit', cleanup);
process.on('SIGINT', () => process.exit(0));
process.on('SIGTERM', () => process.exit(0));

process.argv.push('--production');
require(path.join(ROOT, 'server/index.cjs'));
