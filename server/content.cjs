// CMS content model: collection definitions (DB <-> API field mapping), settings and pricing.
const { run, get, all } = require('./db.cjs');
const DEFAULTS = require('../shared/defaultContent.json');
const THEMES = require('../shared/themes.json');

const ICONS = ['Scissors', 'Trees', 'Sparkles', 'Wind', 'Shovel', 'Droplets'];

// field: [apiName, dbColumn, type]; type: string | int | number | json | bool
const COLLECTIONS = {
  services: {
    table: 'services',
    fields: [
      ['slug', 'slug', 'string'],
      ['title', 'title', 'string'],
      ['subtitle', 'subtitle', 'string'],
      ['description', 'description', 'string'],
      // Unit price per area unit (sq ft in the current content) and base fee, in site currency.
      ['pricePerM2', 'price_per_m2', 'number'],
      ['basePrice', 'base_price', 'number'],
      ['icon', 'icon', 'string'],
      ['image', 'image', 'string'],
      ['features', 'features', 'json'],
      ['calcName', 'calc_name', 'string'],
      ['heroEmoji', 'hero_emoji', 'string'],
      ['heroLabel', 'hero_label', 'string'],
      ['footerLabel', 'footer_label', 'string'],
      ['isActive', 'is_active', 'bool'],
    ],
    required: ['slug', 'title'],
    validate(item) {
      if (item.slug !== undefined && !/^[a-z0-9-]{2,60}$/.test(item.slug)) return 'Service code (slug) may only contain a-z, 0-9 and hyphens.';
      if (item.icon !== undefined && !ICONS.includes(item.icon)) return 'Invalid icon.';
      if (item.features !== undefined && (!Array.isArray(item.features) || item.features.some((f) => typeof f !== 'string'))) return 'Invalid feature list.';
      for (const k of ['pricePerM2', 'basePrice']) if (item[k] !== undefined && (!Number.isFinite(item[k]) || item[k] < 0)) return 'Prices must be numbers ≥ 0.';
      return null;
    },
    // Public shape = shape the frontend components consume (id = slug)
    toPublic: (r) => ({
      id: r.slug, title: r.title, subtitle: r.subtitle, description: r.description,
      pricePerM2: r.price_per_m2, basePrice: r.base_price, icon: r.icon, image: r.image,
      features: safeJson(r.features, []), calcName: r.calc_name, heroEmoji: r.hero_emoji,
      heroLabel: r.hero_label, footerLabel: r.footer_label,
    }),
  },
  'frequency-options': {
    table: 'frequency_options',
    fields: [
      ['label', 'label', 'string'],
      ['discountPct', 'discount_pct', 'number'],
      ['hint', 'hint', 'string'],
      ['isActive', 'is_active', 'bool'],
    ],
    required: ['label'],
    validate(item) {
      if (item.discountPct !== undefined && (!Number.isFinite(item.discountPct) || item.discountPct < 0 || item.discountPct > 100)) return 'Discount must be between 0 and 100%.';
      return null;
    },
    toPublic: (r) => ({ id: r.id, label: r.label, discountPct: r.discount_pct, hint: r.hint }),
  },
  projects: {
    table: 'projects',
    fields: [
      ['category', 'category', 'string'],
      ['title', 'title', 'string'],
      ['description', 'description', 'string'],
      ['image', 'image', 'string'],
      ['imageAlt', 'image_alt', 'string'],
      ['isActive', 'is_active', 'bool'],
    ],
    required: ['title'],
    validate: () => null,
    toPublic: (r) => ({ id: r.id, category: r.category, title: r.title, description: r.description, image: r.image, imageAlt: r.image_alt }),
  },
  testimonials: {
    table: 'testimonials',
    fields: [
      ['name', 'name', 'string'],
      ['role', 'role', 'string'],
      ['content', 'content', 'string'],
      ['stars', 'stars', 'int'],
      ['avatar', 'avatar', 'string'],
      ['isActive', 'is_active', 'bool'],
    ],
    required: ['name'],
    validate(item) {
      if (item.stars !== undefined && (!Number.isInteger(item.stars) || item.stars < 1 || item.stars > 5)) return 'Stars must be between 1 and 5.';
      return null;
    },
    toPublic: (r) => ({ id: r.id, name: r.name, role: r.role, content: r.content, stars: r.stars, avatar: r.avatar }),
  },
};

function safeJson(text, fallback) {
  try { return JSON.parse(text); } catch { return fallback; }
}

// Coerce & whitelist incoming admin payload. Returns { values: {dbCol: val}, error }
function coerce(def, body, { partial }) {
  const values = {};
  const apiItem = {};
  for (const [api, col, type] of def.fields) {
    if (!(api in body)) continue;
    let v = body[api];
    if (type === 'string') v = v == null ? '' : String(v).slice(0, 5000);
    else if (type === 'int') v = Math.round(Number(v));
    else if (type === 'number') v = Number(v);
    else if (type === 'bool') v = v ? 1 : 0;
    apiItem[api] = v;
    values[col] = type === 'json' ? JSON.stringify(v) : v;
  }
  if (!partial) {
    for (const r of def.required) if (!apiItem[r] || String(apiItem[r]).trim() === '') return { error: `Missing required field: ${r}` };
  } else {
    for (const r of def.required) if (r in apiItem && String(apiItem[r]).trim() === '') return { error: `Field ${r} cannot be empty` };
  }
  const error = def.validate(apiItem);
  return error ? { error } : { values };
}

// Admin shape = public shape + id/slug/isActive
function toAdmin(def, r) {
  const pub = def.toPublic(r);
  return { ...pub, id: r.id, ...(r.slug !== undefined ? { slug: r.slug } : {}), isActive: !!r.is_active };
}

async function listCollection(name, { activeOnly }) {
  const def = COLLECTIONS[name];
  const rows = await all(
    `SELECT * FROM ${def.table} ${activeOnly ? 'WHERE is_active = 1' : ''} ORDER BY sort_order ASC, id ASC`
  );
  return activeOnly ? rows.map(def.toPublic) : rows.map((r) => toAdmin(def, r));
}

// ---------- Settings ----------
async function getSettings() {
  const rows = await all('SELECT key, value FROM site_settings');
  const out = {};
  for (const [section, defVal] of Object.entries(DEFAULTS.settings)) {
    const row = rows.find((r) => r.key === section);
    const saved = row ? safeJson(row.value, {}) : {};
    // Only keys the current code knows about (old/removed fields in the DB are ignored)
    out[section] = { ...defVal, ...Object.fromEntries(Object.entries(saved).filter(([k]) => k in defVal)) };
  }
  return out;
}

function validateSection(section, data) {
  const def = DEFAULTS.settings[section];
  if (!def) return { error: 'Unknown section' };
  if (!data || typeof data !== 'object' || Array.isArray(data)) return { error: 'Invalid data' };
  // A field the server doesn't know usually means the code was updated but the server wasn't restarted:
  // refuse instead of silently dropping the value.
  const unknown = Object.keys(data).filter((k) => !(k in def));
  if (unknown.length) return { error: `The server does not recognise: ${unknown.join(', ')}. Restart the server (npm start) and try again.` };
  const clean = {};
  for (const [key, defVal] of Object.entries(def)) {
    if (!(key in data)) continue;
    const v = data[key];
    if (typeof defVal === 'string') clean[key] = String(v ?? '').slice(0, 5000);
    else if (typeof defVal === 'number') {
      const n = Number(v);
      if (!Number.isFinite(n)) return { error: `${key} must be a number` };
      clean[key] = n;
    } else if (Array.isArray(defVal)) {
      if (!Array.isArray(v)) return { error: `${key} must be a list` };
      const sample = defVal[0];
      if (typeof sample === 'string') clean[key] = v.map((x) => String(x ?? ''));
      else clean[key] = v.map((x) => Object.fromEntries(Object.keys(sample).map((k) => [k, String(x?.[k] ?? '')])));
    }
  }
  if (section === 'theme' && 'active' in clean && !THEMES.some((t) => t.id === clean.active)) {
    return { error: `Unknown theme "${clean.active}". Choose one of: ${THEMES.map((t) => t.id).join(', ')}` };
  }
  return { clean };
}

async function saveSection(section, data) {
  const { clean, error } = validateSection(section, data);
  if (error) return { error };
  const current = (await getSettings())[section];
  const merged = { ...current, ...clean };
  await run(
    `INSERT INTO site_settings (key, value, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP)
     ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = CURRENT_TIMESTAMP`,
    [section, JSON.stringify(merged)]
  );
  return { value: merged };
}

async function getSite() {
  const [settings, services, frequencyOptions, projects, testimonials] = await Promise.all([
    getSettings(),
    listCollection('services', { activeOnly: true }),
    listCollection('frequency-options', { activeOnly: true }),
    listCollection('projects', { activeOnly: true }),
    listCollection('testimonials', { activeOnly: true }),
  ]);
  return { settings, services, frequencyOptions, projects, testimonials };
}

// ---------- Pricing (server is the source of truth) ----------
// Same formula as the calculator UI, rounded to cents: (base + area * rate) * (100 - discount%) / 100
function computeCost(service, area, discountPct) {
  return Math.round((service.basePrice + area * service.pricePerM2) * (100 - discountPct)) / 100;
}

async function priceQuote({ serviceId, gardenArea, frequencyId, frequency }) {
  const row = await get('SELECT * FROM services WHERE slug = ? AND is_active = 1', [serviceId]);
  if (!row) return { error: 'Invalid service.' };
  const service = COLLECTIONS.services.toPublic(row);
  let freq = null;
  if (frequencyId != null) freq = await get('SELECT * FROM frequency_options WHERE id = ? AND is_active = 1', [frequencyId]);
  if (!freq && frequency) freq = await get('SELECT * FROM frequency_options WHERE label = ? AND is_active = 1', [frequency]);
  const area = Math.max(0, Number(gardenArea) || 0);
  const discountPct = freq ? freq.discount_pct : 0;
  return {
    service,
    area,
    frequencyLabel: freq ? freq.label : '',
    estimatedCost: computeCost(service, area, discountPct),
  };
}

module.exports = { COLLECTIONS, ICONS, coerce, listCollection, getSettings, saveSection, getSite, priceQuote, computeCost };
