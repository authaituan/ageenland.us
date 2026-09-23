// Kiểm tra: mọi nội dung trong shared/defaultContent.json đều có ô sửa trong CMS (src/admin/schema.js).
import { readFileSync } from 'node:fs';
import { SETTINGS_SECTIONS, COLLECTIONS } from '../src/admin/schema.js';

const defaults = JSON.parse(readFileSync(new URL('../shared/defaultContent.json', import.meta.url), 'utf8'));
const errors = [];
const typeOf = (v) => Array.isArray(v) ? (typeof v[0] === 'string' ? 'list' : ('href' in v[0] ? 'links' : 'stats')) : typeof v === 'number' ? 'number' : 'string';
const compatible = { string: ['text', 'textarea', 'image'], number: ['number'], list: ['list'], stats: ['stats'], links: ['links'] };

for (const [section, values] of Object.entries(defaults.settings)) {
  const def = SETTINGS_SECTIONS.find((s) => s.key === section);
  if (!def) { errors.push(`Thiếu section "${section}" trong schema`); continue; }
  for (const [key, val] of Object.entries(values)) {
    const f = def.fields.find((x) => x.key === key);
    if (!f) errors.push(`Thiếu ô sửa: ${section}.${key}`);
    else if (!compatible[typeOf(val)].includes(f.type)) errors.push(`Sai kiểu: ${section}.${key} (${typeOf(val)} vs ${f.type})`);
  }
  for (const f of def.fields) if (!(f.key in values)) errors.push(`Ô sửa thừa: ${section}.${f.key}`);
}
for (const s of SETTINGS_SECTIONS) if (!(s.key in defaults.settings)) errors.push(`Section thừa: ${s.key}`);

const collectionKeys = { services: 'services', 'frequency-options': 'frequencyOptions', projects: 'projects', testimonials: 'testimonials' };
for (const [name, dataKey] of Object.entries(collectionKeys)) {
  const fields = COLLECTIONS[name].fields.map((f) => f.key);
  for (const key of Object.keys(defaults[dataKey][0])) {
    const k = name === 'services' && key === 'id' ? 'slug' : key;
    if (k === 'id') continue;
    if (!fields.includes(k)) errors.push(`Thiếu ô sửa: ${name}.${k}`);
  }
}

const total = Object.values(defaults.settings).reduce((n, v) => n + Object.keys(v).length, 0);
if (errors.length) { console.error(errors.join('\n')); process.exit(1); }
console.log(`OK – ${total} trường nội dung + 4 danh sách đều có ô sửa trong CMS.`);
