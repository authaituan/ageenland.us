// Chạy cùng lúc backend (npm run server) và website (npm run dev) trong 1 cửa sổ terminal.
// Ctrl+C để tắt cả hai.
const { spawn } = require('child_process');

const isWin = process.platform === 'win32';
const npm = isWin ? 'npm.cmd' : 'npm';
const procs = [
  ['server', ['run', 'server']],
  ['web   ', ['run', 'dev']],
].map(([name, args]) => {
  const p = spawn(npm, args, { stdio: ['ignore', 'pipe', 'pipe'], env: process.env, shell: isWin });
  const prefix = (chunk) => chunk.toString().split(/\r?\n/).filter(Boolean).forEach((l) => console.log(`[${name}] ${l}`));
  p.stdout.on('data', prefix);
  p.stderr.on('data', prefix);
  p.on('exit', (code) => {
    console.log(`[${name}] đã dừng (mã ${code}). Tắt tiến trình còn lại...`);
    shutdown(code || 0);
  });
  return p;
});

let stopping = false;
function shutdown(code) {
  if (stopping) return;
  stopping = true;
  for (const p of procs) {
    if (p.exitCode !== null) continue;
    if (isWin) spawn('taskkill', ['/pid', String(p.pid), '/T', '/F'], { stdio: 'ignore' });
    else p.kill('SIGTERM');
  }
  setTimeout(() => process.exit(code), 500);
}
process.on('SIGINT', () => shutdown(0));
process.on('SIGTERM', () => shutdown(0));
