// Sinh SQL nạp nội dung mặc định từ shared/defaultContent.json (thay cho seed() của server/db.cjs cũ).
// Giống bản cũ: settings chỉ thêm section còn thiếu; mỗi danh sách chỉ nạp khi bảng đang trống.
import fs from 'node:fs';
import path from 'node:path';
import { ROOT, lit } from './lib.mjs';

export function seedSql() {
  const D = JSON.parse(fs.readFileSync(path.join(ROOT, 'shared', 'defaultContent.json'), 'utf8'));
  const out = [];
  for (const [key, value] of Object.entries(D.settings)) {
    out.push(`INSERT OR IGNORE INTO site_settings (key, value) VALUES (${lit(key)}, ${lit(JSON.stringify(value))});`);
  }
  // INSERT ... SELECT * FROM (VALUES ...) WHERE NOT EXISTS: cả danh sách nạp trong 1 lệnh, chỉ khi bảng trống.
  const insertAll = (table, cols, rows) => {
    if (!rows.length) return;
    const values = rows.map((r) => `(${r.map(lit).join(', ')})`).join(',\n  ');
    out.push(`INSERT INTO ${table} (${cols.join(', ')}) SELECT * FROM (VALUES\n  ${values}) WHERE NOT EXISTS (SELECT 1 FROM ${table});`);
  };
  insertAll('services',
    ['slug', 'title', 'subtitle', 'description', 'price_per_m2', 'base_price', 'icon', 'image', 'features', 'calc_name', 'hero_emoji', 'hero_label', 'footer_label', 'sort_order'],
    D.services.map((s, i) => [s.id, s.title, s.subtitle, s.description, s.pricePerM2, s.basePrice, s.icon, s.image, JSON.stringify(s.features), s.calcName, s.heroEmoji, s.heroLabel, s.footerLabel, i]));
  insertAll('frequency_options', ['id', 'label', 'discount_pct', 'hint', 'sort_order'],
    D.frequencyOptions.map((f, i) => [f.id, f.label, f.discountPct, f.hint, i]));
  insertAll('projects', ['category', 'title', 'description', 'image', 'image_alt', 'sort_order'],
    D.projects.map((p, i) => [p.category, p.title, p.description, p.image, p.imageAlt, i]));
  insertAll('testimonials', ['name', 'role', 'content', 'stars', 'avatar', 'sort_order'],
    D.testimonials.map((t, i) => [t.name, t.role, t.content, t.stars, t.avatar, i]));
  return out.join('\n') + '\n';
}
