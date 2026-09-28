// API công khai cho website (không cần đăng nhập). Chuyển từ server/routes/public.cjs, logic giữ nguyên.
import { Hono } from 'hono';
import { run } from '../db.js';
import { getSite, getSettings, priceQuote } from '../content.js';
import { readJson } from '../http.js';

const app = new Hono();

const str = (v, max = 500) => (v == null ? '' : String(v).trim().slice(0, max));
const bad = (c, message) => c.json({ success: false, message }, 400);

// Toàn bộ nội dung website trong 1 request.
app.get('/site', async (c) => {
  c.header('Cache-Control', 'no-store');
  return c.json({ success: true, data: await getSite() });
});

// Báo giá từ Calculator. Giá do server tính lại.
app.post('/quotes', async (c) => {
  const b = (await readJson(c)) || {};
  const fullName = str(b.fullName, 120);
  const phone = str(b.phone, 30);
  const address = str(b.address, 300);
  if (!fullName || !phone || !address) return bad(c, 'Please enter your full name, phone number and address.');
  const priced = await priceQuote({ serviceId: str(b.serviceId, 60), gardenArea: b.gardenArea, frequencyId: b.frequencyId, frequency: str(b.frequency, 60) });
  if (priced.error) return bad(c, priced.error);

  const result = await run(
    `INSERT INTO quotes (fullName, phone, email, serviceId, serviceName, gardenArea, frequency, address, preferredDate, notes, estimatedCost)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [fullName, phone, str(b.email, 120), priced.service.id, priced.service.calcName || priced.service.title, priced.area,
      priced.frequencyLabel || str(b.frequency, 60) || 'One-time', address, str(b.preferredDate, 20), str(b.notes, 2000), priced.estimatedCost]
  );
  return c.json({ success: true, quoteId: result.lastID, estimatedCost: priced.estimatedCost });
});

// Form Liên hệ.
app.post('/contact', async (c) => {
  const b = (await readJson(c)) || {};
  const name = str(b.name, 120);
  const phone = str(b.phone, 30);
  const message = str(b.message, 3000);
  if (!name || !phone || !message) return bad(c, 'Please enter your name, phone number and message.');
  await run('INSERT INTO contacts (name, phone, email, message, source) VALUES (?, ?, ?, ?, ?)', [name, phone, str(b.email, 120), message, 'contact']);
  const settings = await getSettings();
  return c.json({ success: true, message: settings.contact.success_message });
});

// Đăng ký khảo sát nhanh ở Hero.
app.post('/leads', async (c) => {
  const b = (await readJson(c)) || {};
  const phone = str(b.phone, 30);
  if (!phone) return bad(c, 'Phone number is required');
  const service = str(b.serviceLabel, 200);
  await run('INSERT INTO contacts (name, phone, email, message, source) VALUES (?, ?, ?, ?, ?)',
    ['(Quick site visit request)', phone, '', `Free site visit request${service ? ` – Service of interest: ${service}` : ''}`, 'hero']);
  return c.json({ success: true });
});

export default app;
