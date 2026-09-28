// Chép database THẬT (Cloudflare) về máy để thử nghiệm — GHI ĐÈ database local. Không chép ảnh (ảnh thiếu ở local chỉ hiện ô trống).
// Cách dùng: npm run db:pull
import fs from 'node:fs';
import path from 'node:path';
import { ROOT, ask, execFile, flag, main } from './lib.mjs';
import { backup } from './db-backup.mjs';

main(async () => {
  if (!flag('--yes')) {
    const a = await ask('Database LOCAL sẽ bị thay bằng bản sao dữ liệu thật. Gõ "yes" để tiếp tục: ');
    if (a.trim().toLowerCase() !== 'yes') { console.log('Đã huỷ.'); return; }
  }
  const localBackup = backup({ remote: false });
  const remoteFile = backup({ remote: true });
  // Xoá database local (D1 giả lập) rồi nạp bản export — bản export đã gồm cả bảng d1_migrations.
  const d1Dir = path.join(process.env.CF_PERSIST_DIR || path.join(ROOT, '.wrangler', 'state'), 'v3', 'd1');
  fs.rmSync(d1Dir, { recursive: true, force: true });
  execFile(fs.readFileSync(path.join(ROOT, remoteFile), 'utf8'));
  console.log(`Xong. Local = bản sao Cloudflare (${remoteFile}). Bản local cũ: ${localBackup}`);
});
