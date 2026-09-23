const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Initialize SQLite database
const dbPath = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database.');
  }
});

// Create tables
db.serialize(() => {
  db.run(`
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
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS contacts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      email TEXT,
      message TEXT NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
});

// Predefined services data
const SERVICES = [
  {
    id: 'lawn-mowing',
    title: 'Cắt cỏ & Chăm sóc thảm cỏ',
    subtitle: 'Lawn Mowing & Turf Care',
    description: 'Dịch vụ cắt cỏ chuyên nghiệp, xén viền thảm cỏ sắc nét, xử lý cỏ dại và bảo dưỡng thảm cỏ định kỳ cho biệt thự, resort và sân vườn.',
    pricePerM2: 8000,
    basePrice: 200000,
    icon: 'Scissors',
    image: '/images/lawn_care.png',
    features: ['Cắt cỏ chiều cao chuẩn kỹ thuật', 'Xén viền lối đi & bồn hoa', 'Thổi sạch cỏ vụn & vệ sinh', 'Bón phân dưỡng cỏ theo mùa']
  },
  {
    id: 'tree-planting',
    title: 'Trồng cây & Cắt tỉa tạo hình',
    subtitle: 'Tree Planting & Topiary',
    description: 'Cung cấp và trồng các loại cây bóng mát, cây phong thủy, tỉa cành an toàn, tạo dáng bonsai và cắt tỉa cây hàng rào nghệ thuật.',
    pricePerM2: 15000,
    basePrice: 500000,
    icon: 'Trees',
    image: '/images/tree_planting.png',
    features: ['Cung cấp cây giống khỏe mạnh', 'Thi công đào hố & cải tạo đất', 'Tỉa cành hạ độ cao an toàn', 'Định hình dáng cây thẩm mỹ']
  },
  {
    id: 'landscape-design',
    title: 'Xử lý & Thiết kế cảnh quan sân vườn',
    subtitle: 'Landscape Design & Transformation',
    description: 'Cải tạo toàn bộ sân vườn cũ, phối kết đá cảnh quan, lối đi dạo, đồi cỏ, tiểu cảnh nước và hệ thống cây tầm trung sang trọng.',
    pricePerM2: 45000,
    basePrice: 1500000,
    icon: 'Sparkles',
    image: '/images/landscape_design.png',
    features: ['Bản vẽ phối cảnh 3D miễn phí', 'Thi công tiểu cảnh & lối đi đá', 'Trồng cỏ nhung & phối kết hoa', 'Đèn LED âm sân vườn sang trọng']
  },
  {
    id: 'leaf-cleanup',
    title: 'Dọn dẹp & Vệ sinh sân vườn theo mùa',
    subtitle: 'Seasonal Cleanup & Leaf Removal',
    description: 'Thu dọn cành lá khô, phát quang bụi rậm, vệ sinh bùn đất sau mưa bão và thu gom rác thải sân vườn trọn gói.',
    pricePerM2: 5000,
    basePrice: 300000,
    icon: 'Wind',
    image: '/images/hero.png',
    features: ['Thổi & gom lá khô tận gốc', 'Chặt tỉa bụi rậm rậm rạp', 'Phát quang diện tích lớn', 'Thu gom vận chuyển sạch sẽ']
  },
  {
    id: 'mulching-soil',
    title: 'Phủ mùn & Cải tạo dinh dưỡng đất',
    subtitle: 'Mulching & Soil Enrichment',
    description: 'Bổ sung lớp mùn vỏ cây bảo vệ gốc, bón phân vi sinh hữu cơ cải tạo độ tơi xốp cho đất giúp cây phát triển bền vững.',
    pricePerM2: 12000,
    basePrice: 350000,
    icon: 'Shovel',
    image: '/images/tree_planting.png',
    features: ['Mùn dăm gỗ nhập khẩu chuẩn', 'Giữ ẩm & ngăn cỏ dại mọc', 'Bổ sung vi sinh cải tạo đất', 'Tăng tính thẩm mỹ bồn cây']
  },
  {
    id: 'irrigation-system',
    title: 'Hệ thống tưới tự động thông minh',
    subtitle: 'Smart Garden Irrigation',
    description: 'Lắp đặt & sửa chữa hệ thống tưới phun mưa, tưới nhỏ giọt hẹn giờ tự động, tiết kiệm 50% nước và công sức chăm sóc.',
    pricePerM2: 25000,
    basePrice: 800000,
    icon: 'Droplets',
    image: '/images/landscape_design.png',
    features: ['Bơm & bộ hẹn giờ thông minh', 'Vòi tưới xoay 360 độ góc ẩn', 'Cảm biến mưa tự ngắt', 'Bảo hành hệ thống 24 tháng']
  }
];

// Predefined Projects / Portfolio
const PROJECTS = [
  {
    id: 1,
    title: 'Cải Tạo Cảnh Quan Biệt Thự Ecopark',
    category: 'Biệt thự',
    location: 'Hà Nội',
    area: '450 m²',
    beforeImage: '/images/before_garden.png',
    afterImage: '/images/after_garden.png',
    description: 'Biến bãi cỏ hoang tàn thành thiên đường nghỉ dưỡng ngoài trời với thảm cỏ nhung, hồ tiểu cảnh và đá dạo lối đi.'
  },
  {
    id: 2,
    title: 'Thi Kế Sân Vườn Đồi Cỏ Villa Thảo Điền',
    category: 'Biệt thự',
    location: 'TP. Hồ Chí Minh',
    area: '620 m²',
    beforeImage: '/images/lawn_care.png',
    afterImage: '/images/landscape_design.png',
    description: 'Thi công thảm cỏ Nhật kết hợp dải cây tầm trung, hệ thống tưới âm đất và đèn sân vườn chiếu sáng tự động.'
  },
  {
    id: 3,
    title: 'Trồng Cây Bóng Mát & Cắt Tỉa Khu Resort',
    category: 'Resort',
    location: 'Đà Nẵng',
    area: '1,200 m²',
    beforeImage: '/images/tree_planting.png',
    afterImage: '/images/hero.png',
    description: 'Cung cấp 30 cây bóng mát lớn, cắt tỉa định hình hàng rào cây xanh nghệ thuật.'
  }
];

// API Endpoints
app.get('/api/services', (req, res) => {
  res.json({ success: true, data: SERVICES });
});

app.get('/api/projects', (req, res) => {
  res.json({ success: true, data: PROJECTS });
});

app.get('/api/stats', (req, res) => {
  db.get('SELECT COUNT(*) as totalQuotes FROM quotes', [], (err, row) => {
    const totalQuotes = row ? row.totalQuotes : 0;
    res.json({
      success: true,
      data: {
        totalQuotes: totalQuotes + 128,
        satisfiedClients: '99%',
        landscapedArea: '45,000+ m²',
        completedProjects: 240
      }
    });
  });
});

// Submit Quote Request
app.post('/api/quotes', (req, res) => {
  const { fullName, phone, email, serviceId, serviceName, gardenArea, frequency, address, preferredDate, notes, estimatedCost } = req.body;

  if (!fullName || !phone || !address) {
    return res.status(400).json({ success: false, message: 'Vui lòng điền đầy đủ Họ tên, Số điện thoại và Địa chỉ!' });
  }

  const query = `
    INSERT INTO quotes (fullName, phone, email, serviceId, serviceName, gardenArea, frequency, address, preferredDate, notes, estimatedCost)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.run(query, [fullName, phone, email || '', serviceId || '', serviceName || '', gardenArea || 0, frequency || 'Lần đầu', address, preferredDate || '', notes || '', estimatedCost || 0], function (err) {
    if (err) {
      console.error('Error inserting quote:', err.message);
      return res.status(500).json({ success: false, message: 'Lỗi máy chủ khi lưu báo giá!' });
    }
    res.json({
      success: true,
      message: 'Cảm ơn bạn! Yêu cầu báo giá đã gửi thành công. Kỹ sư cảnh quan của GreenLand sẽ liên hệ trong vòng 15 phút.',
      quoteId: this.lastID
    });
  });
});

// Get all quotes (Admin view)
app.get('/api/quotes', (req, res) => {
  db.all('SELECT * FROM quotes ORDER BY createdAt DESC', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
    res.json({ success: true, data: rows });
  });
});

// Update Quote Status (Admin)
app.patch('/api/quotes/:id', (req, res) => {
  const { status } = req.body;
  const { id } = req.params;
  db.run('UPDATE quotes SET status = ? WHERE id = ?', [status, id], function (err) {
    if (err) return res.status(500).json({ success: false, message: err.message });
    res.json({ success: true, message: 'Đã cập nhật trạng thái báo giá.' });
  });
});

// Contact Submission
app.post('/api/contact', (req, res) => {
  const { name, phone, email, message } = req.body;
  if (!name || !phone || !message) {
    return res.status(400).json({ success: false, message: 'Vui lòng điền Họ tên, Số điện thoại và Lời nhắn!' });
  }
  db.run('INSERT INTO contacts (name, phone, email, message) VALUES (?, ?, ?, ?)', [name, phone, email || '', message], function (err) {
    if (err) return res.status(500).json({ success: false, message: err.message });
    res.json({ success: true, message: 'Gửi lời nhắn thành công! GreenLand sẽ phản hồi sớm nhất.' });
  });
});

// Serve static frontend assets in production if built
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`GreenLand Backend API is running on port http://localhost:${PORT}`);
});
