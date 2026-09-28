// Tiện ích HTTP dùng chung: đọc JSON giống express.json() (giới hạn 1 MB, JSON lỗi → 400 "Invalid JSON").
import { HTTPException } from 'hono/http-exception';

const JSON_LIMIT = 1024 * 1024;
const fail = (status, message) => new HTTPException(status, { res: Response.json({ success: false, message }, { status }) });

// Trả undefined khi request không phải JSON (Express cũng để req.body = undefined).
export async function readJson(c) {
  if (!(c.req.header('content-type') || '').startsWith('application/json')) return undefined;
  if (Number(c.req.header('content-length') || 0) > JSON_LIMIT) throw fail(413, 'Request too large');
  const text = await c.req.text();
  if (text.length > JSON_LIMIT) throw fail(413, 'Request too large');
  if (!text) return undefined;
  try { return JSON.parse(text); } catch { throw fail(400, 'Invalid JSON'); }
}
