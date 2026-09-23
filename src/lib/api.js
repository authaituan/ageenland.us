// Same-origin API helper (Vite proxies /api in dev; Express serves both in production).
export async function api(path, { method = 'GET', body, form } = {}) {
  const opts = { method, credentials: 'same-origin', headers: {} };
  if (form) {
    opts.body = form;
    opts.headers['X-Requested-With'] = 'fetch';
  } else if (body !== undefined) {
    opts.body = JSON.stringify(body);
    opts.headers['Content-Type'] = 'application/json';
  }
  const res = await fetch(`/api${path}`, opts);
  let data = null;
  try { data = await res.json(); } catch { /* non-JSON */ }
  if (!res.ok || !data || data.success === false) {
    const err = new Error(data?.message || `HTTP ${res.status}`);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

// "Từ {price}đ" + { price: '8.000' } -> "Từ 8.000đ"
export function fmt(template, vars = {}) {
  return String(template ?? '').replace(/\{(\w+)\}/g, (m, k) => (k in vars ? vars[k] : m));
}
