// SQLite connection, promise helpers, schema migration and seed.
const path = require('path');
const fs = require('fs');
const sqlite3 = require('sqlite3');
const DEFAULTS = require('../shared/defaultContent.json');

const DB_PATH = process.env.DB_PATH || path.join(__dirname, 'database.sqlite');
fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });

const db = new sqlite3.Database(DB_PATH);

const run = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) return reject(err);
      resolve({ lastID: this.lastID, changes: this.changes });
    });
  });
const get = (sql, params = []) =>
  new Promise((resolve, reject) => db.get(sql, params, (err, row) => (err ? reject(err) : resolve(row))));
const all = (sql, params = []) =>
  new Promise((resolve, reject) => db.all(sql, params, (err, rows) => (err ? reject(err) : resolve(rows))));

async function columnExists(table, column) {
  const cols = await all(`PRAGMA table_info(${table})`);
  return cols.some((c) => c.name === column);
}

async function migrate() {
  await run('PRAGMA foreign_keys = ON');

  // --- Existing operational tables (kept compatible with the original schema) ---
  await run(`CREATE TABLE IF NOT EXISTS quotes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    fullName TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    serviceId TEXT NOT NULL,
    serviceName TEXT NOT NULL,
    gardenArea REAL DEFAULT 0,
    frequency TEXT,
    address TEXT NOT NULL,
    preferredDate TEXT,
    notes TEXT,
    estimatedCost INTEGER,
    status TEXT DEFAULT 'Pending',
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
  await run(`CREATE TABLE IF NOT EXISTS contacts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    message TEXT NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
  if (!(await columnExists('contacts', 'status'))) {
    await run(`ALTER TABLE contacts ADD COLUMN status TEXT DEFAULT 'New'`);
  }
  if (!(await columnExists('contacts', 'source'))) {
    await run(`ALTER TABLE contacts ADD COLUMN source TEXT DEFAULT 'contact'`);
  }

  // --- Admin auth ---
  await run(`CREATE TABLE IF NOT EXISTS admin_users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    display_name TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_login_at DATETIME
  )`);
  await run(`CREATE TABLE IF NOT EXISTS admin_sessions (
    token_hash TEXT PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
    expires_at INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // --- CMS content ---
  await run(`CREATE TABLE IF NOT EXISTS site_settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
  await run(`CREATE TABLE IF NOT EXISTS services (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    subtitle TEXT DEFAULT '',
    description TEXT DEFAULT '',
    price_per_m2 INTEGER NOT NULL DEFAULT 0,
    base_price INTEGER NOT NULL DEFAULT 0,
    icon TEXT DEFAULT 'Scissors',
    image TEXT DEFAULT '',
    features TEXT DEFAULT '[]',
    calc_name TEXT DEFAULT '',
    hero_emoji TEXT DEFAULT '',
    hero_label TEXT DEFAULT '',
    footer_label TEXT DEFAULT '',
    sort_order INTEGER DEFAULT 0,
    is_active INTEGER DEFAULT 1,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
  await run(`CREATE TABLE IF NOT EXISTS frequency_options (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    label TEXT NOT NULL,
    discount_pct REAL NOT NULL DEFAULT 0,
    hint TEXT DEFAULT '',
    sort_order INTEGER DEFAULT 0,
    is_active INTEGER DEFAULT 1,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
  await run(`CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category TEXT DEFAULT '',
    title TEXT NOT NULL,
    description TEXT DEFAULT '',
    image TEXT DEFAULT '',
    image_alt TEXT DEFAULT '',
    sort_order INTEGER DEFAULT 0,
    is_active INTEGER DEFAULT 1,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
  await run(`CREATE TABLE IF NOT EXISTS testimonials (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    role TEXT DEFAULT '',
    content TEXT DEFAULT '',
    stars INTEGER DEFAULT 5,
    avatar TEXT DEFAULT '',
    sort_order INTEGER DEFAULT 0,
    is_active INTEGER DEFAULT 1,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
}

// Seed = exactly what the site displayed before the CMS existed (shared/defaultContent.json).
// Collections are seeded only when empty; settings sections only when missing.
async function seed() {
  for (const [key, value] of Object.entries(DEFAULTS.settings)) {
    await run('INSERT OR IGNORE INTO site_settings (key, value) VALUES (?, ?)', [key, JSON.stringify(value)]);
  }

  const count = async (t) => (await get(`SELECT COUNT(*) AS n FROM ${t}`)).n;

  if ((await count('services')) === 0) {
    let i = 0;
    for (const s of DEFAULTS.services) {
      await run(
        `INSERT INTO services (slug, title, subtitle, description, price_per_m2, base_price, icon, image, features,
          calc_name, hero_emoji, hero_label, footer_label, sort_order) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
        [s.id, s.title, s.subtitle, s.description, s.pricePerM2, s.basePrice, s.icon, s.image, JSON.stringify(s.features),
          s.calcName, s.heroEmoji, s.heroLabel, s.footerLabel, i++]
      );
    }
  }
  if ((await count('frequency_options')) === 0) {
    let i = 0;
    for (const f of DEFAULTS.frequencyOptions) {
      await run('INSERT INTO frequency_options (id, label, discount_pct, hint, sort_order) VALUES (?,?,?,?,?)',
        [f.id, f.label, f.discountPct, f.hint, i++]);
    }
  }
  if ((await count('projects')) === 0) {
    let i = 0;
    for (const p of DEFAULTS.projects) {
      await run('INSERT INTO projects (category, title, description, image, image_alt, sort_order) VALUES (?,?,?,?,?,?)',
        [p.category, p.title, p.description, p.image, p.imageAlt, i++]);
    }
  }
  if ((await count('testimonials')) === 0) {
    let i = 0;
    for (const t of DEFAULTS.testimonials) {
      await run('INSERT INTO testimonials (name, role, content, stars, avatar, sort_order) VALUES (?,?,?,?,?,?)',
        [t.name, t.role, t.content, t.stars, t.avatar, i++]);
    }
  }
}

async function init() {
  await migrate();
  await seed();
}

module.exports = { db, run, get, all, init, DB_PATH };
