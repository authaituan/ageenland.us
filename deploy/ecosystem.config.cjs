// PM2 – giữ GreenLand chạy nền và tự bật lại khi máy chủ khởi động lại.
// Dùng:  pm2 start deploy/ecosystem.config.cjs && pm2 save
// Sửa các đường dẫn/biến bên dưới cho đúng máy chủ trước khi chạy.
module.exports = {
  apps: [
    {
      name: 'greenland',
      script: 'server/index.cjs',
      args: '--production',
      cwd: __dirname + '/..',
      instances: 1, // SQLite: chỉ chạy 1 tiến trình
      autorestart: true,
      max_memory_restart: '300M',
      env: {
        NODE_ENV: 'production',
        GREENLAND_PORT: 5454,
        // Dữ liệu để NGOÀI thư mục code → cập nhật code không mất dữ liệu
        DB_PATH: '/var/lib/greenland/database.sqlite',
        UPLOAD_DIR: '/var/lib/greenland/uploads',
        COOKIE_SECURE: '1', // bật khi đã có HTTPS; tạm để '' nếu chỉ chạy http://IP:5454
        TRUST_PROXY: '1', // chạy sau nginx
      },
    },
  ],
};
