// Sao lưu database ra file SQL trong server/backups/ (không commit).
// Cách dùng: npm run db:backup              (mặc định: Cloudflare — dữ liệu THẬT)
//            npm run db:backup -- --local   (database local)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ROOT, BACKUP_DIR, DB_NAME, REMOTE, wrangler, stamp, main } from './lib.mjs';

export function backup({ remote = REMOTE } = {}) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
  const out = path.join(BACKUP_DIR, `${remote ? 'remote' : 'local'}-${stamp()}.sql`);
  const loc = remote ? ['--remote'] : ['--local', ...(process.env.CF_PERSIST_DIR ? ['--persist-to', process.env.CF_PERSIST_DIR] : [])];
  wrangler(['d1', 'export', DB_NAME, ...loc, '--output', out], { capture: true });
  return path.relative(ROOT, out);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main(async () => {
    const remote = !process.argv.includes('--local');
    console.log(`Đã sao lưu database ${remote ? 'Cloudflare' : 'local'}: ${backup({ remote })}`);
  });
}
