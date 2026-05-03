const express  = require('express');
const cors     = require('cors');
const path     = require('path');

const productsRouter = require('./routes/products');
const ordersRouter   = require('./routes/orders');

const app  = express();
const PORT = process.env.PORT || 3000;

// ═══════════════════════════════
//  MIDDLEWARE
// ═══════════════════════════════
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging
app.use((req, res, next) => {
  const time = new Date().toLocaleTimeString('ar-DZ');
  console.log(`[${time}] ${req.method} ${req.url}`);
  next();
});

// ═══════════════════════════════
//  API ROUTES
// ═══════════════════════════════
app.use('/api/products', productsRouter);
app.use('/api/orders',   ordersRouter);

// Admin login
const ADMIN = { username: 'admin', password: 'lamsa2025' };
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  if (username === ADMIN.username && password === ADMIN.password) {
    res.json({ success: true, token: Buffer.from(`${username}:${password}`).toString('base64') });
  } else {
    res.status(401).json({ success: false, message: 'اسم المستخدم أو كلمة السر غلط' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: '✅ لمسة أنثى API تعمل بشكل مثالي',
    shop:    'لمسة أنثى — العلمة، سطيف',
    time:    new Date().toISOString(),
  });
});

// ═══════════════════════════════
//  STATIC FILES (الواجهة)
// ═══════════════════════════════
app.use(express.static(path.join(__dirname, 'public')));

// admin.html
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});
app.get('/admin.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// كل route ثاني يرجع index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ═══════════════════════════════
//  ERROR HANDLER
// ═══════════════════════════════
app.use((err, req, res, next) => {
  console.error('❌ خطأ:', err.message);
  res.status(500).json({ success: false, message: 'خطأ في السيرفر', error: err.message });
});

// ═══════════════════════════════
//  START
// ═══════════════════════════════
app.listen(PORT, () => {
  console.log('');
  console.log('╔══════════════════════════════════════╗');
  console.log('║       👗  لمسة أنثى — الباك إند      ║');
  console.log('║       العلمة، سطيف — الجزائر         ║');
  console.log('╠══════════════════════════════════════╣');
  console.log(`║  🚀  http://localhost:${PORT}            ║`);
  console.log('╠══════════════════════════════════════╣');
  console.log('║  📦  GET  /api/products               ║');
  console.log('║  📦  POST /api/products               ║');
  console.log('║  🛒  GET  /api/orders                 ║');
  console.log('║  🛒  POST /api/orders                 ║');
  console.log('║  📊  GET  /api/orders/stats           ║');
  console.log('║  💚  GET  /api/health                 ║');
  console.log('╚══════════════════════════════════════╝');
  console.log('');
});

module.exports = app;
