// Public API used by the website (no authentication).
const express = require('express');
const { run } = require('../db.cjs');
const { getSite, getSettings, priceQuote } = require('../content.cjs');

const router = express.Router();

const str = (v, max = 500) => (v == null ? '' : String(v).trim().slice(0, max));

// All content the website renders, in one request.
router.get('/site', async (req, res, next) => {
  try {
    res.set('Cache-Control', 'no-store');
    res.json({ success: true, data: await getSite() });
  } catch (e) { next(e); }
});

// Quote request from the cost calculator. Price is recomputed server-side.
router.post('/quotes', async (req, res, next) => {
  try {
    const b = req.body || {};
    const fullName = str(b.fullName, 120);
    const phone = str(b.phone, 30);
    const address = str(b.address, 300);
    if (!fullName || !phone || !address) {
      return res.status(400).json({ success: false, message: 'Vui lòng điền đầy đủ Họ tên, Số điện thoại và Địa chỉ!' });
    }
    const priced = await priceQuote({ serviceId: str(b.serviceId, 60), gardenArea: b.gardenArea, frequencyId: b.frequencyId, frequency: str(b.frequency, 60) });
    if (priced.error) return res.status(400).json({ success: false, message: priced.error });

    const result = await run(
      `INSERT INTO quotes (fullName, phone, email, serviceId, serviceName, gardenArea, frequency, address, preferredDate, notes, estimatedCost)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [fullName, phone, str(b.email, 120), priced.service.id, priced.service.calcName || priced.service.title, priced.area,
        priced.frequencyLabel || str(b.frequency, 60) || 'Lần đầu', address, str(b.preferredDate, 20), str(b.notes, 2000), priced.estimatedCost]
    );
    res.json({ success: true, quoteId: result.lastID, estimatedCost: priced.estimatedCost });
  } catch (e) { next(e); }
});

// Contact form.
router.post('/contact', async (req, res, next) => {
  try {
    const b = req.body || {};
    const name = str(b.name, 120);
    const phone = str(b.phone, 30);
    const message = str(b.message, 3000);
    if (!name || !phone || !message) {
      return res.status(400).json({ success: false, message: 'Vui lòng điền Họ tên, Số điện thoại và Lời nhắn!' });
    }
    await run('INSERT INTO contacts (name, phone, email, message, source) VALUES (?, ?, ?, ?, ?)', [name, phone, str(b.email, 120), message, 'contact']);
    const settings = await getSettings();
    res.json({ success: true, message: settings.contact.success_message });
  } catch (e) { next(e); }
});

// Quick survey request from the Hero card (previously the phone number was discarded).
router.post('/leads', async (req, res, next) => {
  try {
    const b = req.body || {};
    const phone = str(b.phone, 30);
    if (!phone) return res.status(400).json({ success: false, message: 'Thiếu số điện thoại' });
    const service = str(b.serviceLabel, 200);
    await run('INSERT INTO contacts (name, phone, email, message, source) VALUES (?, ?, ?, ?, ?)',
      ['(Đăng ký khảo sát nhanh)', phone, '', `Đăng ký khảo sát miễn phí${service ? ` – Dịch vụ quan tâm: ${service}` : ''}`, 'hero']);
    res.json({ success: true });
  } catch (e) { next(e); }
});

module.exports = router;
