-- Schema ban đầu trên D1 = schema cuối cùng của server/db.cjs (Express/SQLite) + bảng đếm đăng nhập sai.
-- Quy tắc (D27): chỉ THÊM migration mới (0002_..., 0003_...), không sửa file đã chạy.

CREATE TABLE IF NOT EXISTS quotes (
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
);

CREATE TABLE IF NOT EXISTS contacts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  message TEXT NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  status TEXT DEFAULT 'New',
  source TEXT DEFAULT 'contact'
);

CREATE TABLE IF NOT EXISTS admin_users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  display_name TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  last_login_at DATETIME
);

CREATE TABLE IF NOT EXISTS admin_sessions (
  token_hash TEXT PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
  expires_at INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Thay cho bộ đếm trong RAM của Express (Worker không giữ bộ nhớ giữa các request).
CREATE TABLE IF NOT EXISTS login_failures (
  ip TEXT PRIMARY KEY,
  first_at INTEGER NOT NULL,
  count INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS site_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS services (
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
);

CREATE TABLE IF NOT EXISTS frequency_options (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  label TEXT NOT NULL,
  discount_pct REAL NOT NULL DEFAULT 0,
  hint TEXT DEFAULT '',
  sort_order INTEGER DEFAULT 0,
  is_active INTEGER DEFAULT 1,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS projects (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  category TEXT DEFAULT '',
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  image TEXT DEFAULT '',
  image_alt TEXT DEFAULT '',
  sort_order INTEGER DEFAULT 0,
  is_active INTEGER DEFAULT 1,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS testimonials (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  role TEXT DEFAULT '',
  content TEXT DEFAULT '',
  stars INTEGER DEFAULT 5,
  avatar TEXT DEFAULT '',
  sort_order INTEGER DEFAULT 0,
  is_active INTEGER DEFAULT 1,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
