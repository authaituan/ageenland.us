// Lớp truy cập D1, giữ đúng tên/kết quả của server/db.cjs cũ (run/get/all) để content.js và routes không phải đổi.
// Binding D1 được gắn 1 lần mỗi request (worker/index.js); mọi request dùng chung 1 binding nên biến module là an toàn.
let DB = null;
export const bindDb = (d1) => { DB = d1; };

// D1 không nhận undefined → đổi thành null (sqlite3 cũ cũng lưu NULL).
const clean = (params) => params.map((v) => (v === undefined ? null : v));
const prep = (sql, params = []) => DB.prepare(sql).bind(...clean(params));

export async function run(sql, params = []) {
  const r = await prep(sql, params).run();
  return { lastID: r.meta.last_row_id, changes: r.meta.changes };
}
export async function get(sql, params = []) {
  return (await prep(sql, params).first()) ?? undefined;
}
export async function all(sql, params = []) {
  return (await prep(sql, params).all()).results;
}
// Nhiều lệnh trong 1 lần gọi (tính là 1 request tới D1, chạy trong 1 transaction).
export async function batch(list) {
  if (!list.length) return [];
  return DB.batch(list.map(([sql, params]) => prep(sql, params)));
}
