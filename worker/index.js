// GreenLand backend trên Cloudflare Worker: API công khai, API quản trị CMS, ảnh upload (R2).
// Trang web (dist/) do Cloudflare Static Assets phục vụ; chỉ /api/* và /uploads/* chạy qua đây (wrangler.jsonc).
import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { bindDb } from './db.js';
import publicRoutes from './routes/public.js';
import adminRoutes from './routes/admin.js';

const app = new Hono();

app.use('*', async (c, next) => {
  bindDb(c.env.DB);
  await next();
  c.header('X-Content-Type-Options', 'nosniff');
});

app.route('/api/admin', adminRoutes);
app.route('/api', publicRoutes);
app.all('/api/*', (c) => c.json({ success: false, message: 'API not found' }, 404));

// Ảnh đã tải lên trong CMS (lưu R2).
app.get('/uploads/:name', async (c) => {
  const name = c.req.param('name');
  if (!/^[\w.-]+$/.test(name)) return c.body(null, 404);
  const obj = await c.env.UPLOADS.get(name);
  if (!obj) return c.body(null, 404);
  const headers = new Headers();
  obj.writeHttpMetadata(headers);
  headers.set('ETag', obj.httpEtag);
  headers.set('Cache-Control', 'public, max-age=604800'); // 7 ngày, như bản Express
  return new Response(obj.body, { headers });
});

app.notFound((c) => (c.req.path.startsWith('/api/')
  ? c.json({ success: false, message: 'API not found' }, 404)
  : c.body(null, 404)));

app.onError((err, c) => {
  if (err instanceof HTTPException) return err.getResponse();
  console.error(err);
  return c.json({ success: false, message: 'Server error' }, 500);
});

export default app;
