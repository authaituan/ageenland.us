# Đưa GreenLand lên hosting (VPS Linux)

Gói phát hành gồm 2 phần tách biệt:

| Phần | Nội dung | Đặt ở đâu trên VPS |
|---|---|---|
| **app** | Code đã build sẵn (`dist/`), `server/`, `shared/`, `deploy/`, `package.json`, `package-lock.json` | `/opt/greenland` |
| **data** | `database.sqlite` (nội dung CMS, tài khoản admin) + `uploads/` (ảnh đã tải lên) | `/var/lib/greenland` |

Tách riêng để lần sau cập nhật code chỉ thay thư mục `app`, dữ liệu không bị ghi đè.

Yêu cầu: VPS **Ubuntu 22.04/24.04**, tối thiểu 1 GB RAM, có quyền `sudo`. (Hosting chia sẻ kiểu cPanel xem mục cuối.)

---

## 1. Cài phần mềm (1 lần)

```bash
sudo apt update && sudo apt install -y nginx unzip sqlite3
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs
sudo npm install -g pm2
node -v   # phải là v22.x
```

## 2. Chép gói lên VPS

Trên Windows, dùng **WinSCP** (kéo thả) hoặc PowerShell:

```powershell
scp greenland-app-*.zip greenland-data-*.zip root@<IP-VPS>:/tmp/
```

Trên VPS:

```bash
sudo mkdir -p /opt/greenland /var/lib/greenland
sudo unzip -o /tmp/greenland-app-*.zip  -d /opt/greenland
sudo unzip -o /tmp/greenland-data-*.zip -d /var/lib/greenland
sudo chown -R $USER /opt/greenland /var/lib/greenland
cd /opt/greenland
npm ci --omit=dev          # cài thư viện chạy (không cần build lại)
```

## 3. Chạy thử nhanh bằng IP (chưa cần tên miền)

```bash
cd /opt/greenland
GREENLAND_PORT=5454 DB_PATH=/var/lib/greenland/database.sqlite UPLOAD_DIR=/var/lib/greenland/uploads \
  node server/index.cjs --production
```

Mở `http://<IP-VPS>:5454` (có thể phải mở cổng: `sudo ufw allow 5454`). Thấy website + đăng nhập được `/admin` là đạt. Bấm Ctrl+C để dừng.

> Lưu ý: khi chạy bằng `http://` (chưa HTTPS) **không** đặt `COOKIE_SECURE=1`, nếu không sẽ không đăng nhập được CMS.

## 4. Chạy nền bằng PM2

Mở `deploy/ecosystem.config.cjs`, kiểm tra đường dẫn. Nếu **chưa có HTTPS**, đổi `COOKIE_SECURE: '1'` thành `COOKIE_SECURE: ''`.

```bash
cd /opt/greenland
pm2 start deploy/ecosystem.config.cjs
pm2 save
pm2 startup      # làm theo dòng lệnh nó in ra để tự chạy khi VPS khởi động lại
pm2 logs greenland   # xem log; dòng đầu phải là "GreenLand backend: http://localhost:5454 (production)"
```

## 5. Tên miền + HTTPS (nginx)

1. Ở nơi quản lý tên miền, tạo bản ghi **A** trỏ `example.com` và `www.example.com` về IP VPS.
2. Cấu hình nginx:
   ```bash
   sudo cp /opt/greenland/deploy/nginx-greenland.conf /etc/nginx/sites-available/greenland
   sudo nano /etc/nginx/sites-available/greenland      # thay example.com bằng tên miền thật
   sudo ln -s /etc/nginx/sites-available/greenland /etc/nginx/sites-enabled/
   sudo nginx -t && sudo systemctl reload nginx
   sudo ufw allow 'Nginx Full' && sudo ufw delete allow 5454
   ```
3. HTTPS miễn phí (Let's Encrypt):
   ```bash
   sudo apt install -y certbot python3-certbot-nginx
   sudo certbot --nginx -d example.com -d www.example.com
   ```
4. Bật lại `COOKIE_SECURE: '1'` trong `deploy/ecosystem.config.cjs`, rồi `pm2 restart greenland --update-env`.

## 6. Sao lưu tự động

```bash
bash /opt/greenland/deploy/backup.sh          # chạy thử → /var/backups/greenland/greenland-<ngày>.tar.gz
crontab -e                                    # thêm dòng:
0 2 * * * bash /opt/greenland/deploy/backup.sh
```

Nên tải định kỳ file sao lưu về máy (WinSCP) — sao lưu chỉ nằm trên VPS thì mất VPS là mất hết.

**Khôi phục:** `pm2 stop greenland` → giải nén file `.tar.gz` vào `/var/lib/greenland` → `pm2 start greenland`.

## 7. Cập nhật code phiên bản mới

```bash
pm2 stop greenland
sudo unzip -o /tmp/greenland-app-<mới>.zip -d /opt/greenland     # KHÔNG giải nén gói data
cd /opt/greenland && npm ci --omit=dev
pm2 restart greenland --update-env
```

## 8. Tài khoản admin trên VPS

Gói data mang theo tài khoản admin từ máy local. Đổi mật khẩu hoặc thêm tài khoản:

```bash
cd /opt/greenland
DB_PATH=/var/lib/greenland/database.sqlite npm run admin:create -- admin1
```

---

## Hosting chia sẻ (cPanel có mục "Setup Node.js App")

Chạy được nếu gói hosting hỗ trợ Node.js ≥ 20. Tạo app với *Application root* = thư mục đã giải nén gói app, *Startup file* = `server/index.cjs`; thêm biến môi trường `NODE_ENV=production`, `DB_PATH`, `UPLOAD_DIR` (trỏ tới thư mục đã giải nén gói data, **ngoài** `public_html`), bấm *Run NPM Install* rồi *Restart*. Không cần `GREENLAND_PORT` (cPanel tự cấp cổng qua Passenger). Thư viện `sqlite3` cần tải bản dựng sẵn khi cài — nếu hosting chặn, phải dùng VPS.
