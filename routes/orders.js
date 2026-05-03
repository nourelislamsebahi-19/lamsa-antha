const express        = require('express');
const { v4: uuidv4 } = require('uuid');
const router         = express.Router();
const db             = require('../db');

// GET /api/orders
router.get('/', (req, res) => {
  let orders = db.getOrders();
  const { status } = req.query;
  if (status) orders = orders.filter(o => o.status === status);
  orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json({ success: true, count: orders.length, data: orders });
});

// GET /api/orders/stats
router.get('/stats', (req, res) => {
  const orders  = db.getOrders();
  const total   = orders.length;
  const revenue = orders.reduce((s, o) => s + o.total, 0);
  const pending = orders.filter(o => o.status === 'pending').length;
  const done    = orders.filter(o => o.status === 'done').length;
  res.json({ success: true, data: { total, revenue, pending, done } });
});

// GET /api/orders/:id
router.get('/:id', (req, res) => {
  const order = db.getOrderById(req.params.id);
  if (!order) return res.status(404).json({ success: false, message: 'الطلب غير موجود' });
  res.json({ success: true, data: order });
});

// POST /api/orders
router.post('/', (req, res) => {
  const { items, promoCode } = req.body;
  if (!items || !items.length)
    return res.status(400).json({ success: false, message: 'السلة فارغة' });

  let subtotal   = 0;
  const orderItems = [];

  for (const item of items) {
    const product = db.getProductById(item.productId);
    if (!product)
      return res.status(404).json({ success: false, message: `المنتج ${item.productId} غير موجود` });
    if (product.stock < item.qty)
      return res.status(400).json({ success: false, message: `المخزون غير كافي: ${product.name}` });

    const price = product.salePrice || product.price;
    subtotal += price * item.qty;
    orderItems.push({
      productId: product.id,
      name:      product.name,
      icon:      product.icon,
      cat:       product.cat,
      size:      item.size  || null,
      color:     item.color || null,
      qty:       item.qty,
      price,
      lineTotal: price * item.qty,
    });
  }

  // كود الترقية
  let discount = 0;
  if (promoCode === 'LAMSA10') discount = Math.round(subtotal * 0.1);
  const total = subtotal - discount;

  const newOrder = {
    id:        uuidv4(),
    items:     orderItems,
    subtotal,
    discount,
    promoCode: promoCode || null,
    total,
    status:    'pending',
    createdAt: new Date().toISOString(),
  };

  // تحديث المخزون
  for (const item of items) {
    const product = db.getProductById(item.productId);
    if (product) db.saveProduct({ ...product, stock: product.stock - item.qty });
  }

  db.saveOrder(newOrder);
  res.status(201).json({ success: true, data: newOrder });
});

// PATCH /api/orders/:id/status
router.patch('/:id/status', (req, res) => {
  const order = db.getOrderById(req.params.id);
  if (!order) return res.status(404).json({ success: false, message: 'الطلب غير موجود' });

  const allowed = ['pending', 'confirmed', 'done', 'cancelled'];
  if (!allowed.includes(req.body.status))
    return res.status(400).json({ success: false, message: 'حالة غير صحيحة' });

  const updated = { ...order, status: req.body.status, updatedAt: new Date().toISOString() };
  db.saveOrder(updated);
  res.json({ success: true, data: updated });
});

// DELETE /api/orders/:id
router.delete('/:id', (req, res) => {
  const order = db.getOrderById(req.params.id);
  if (!order) return res.status(404).json({ success: false, message: 'الطلب غير موجود' });
  db.deleteOrder(req.params.id);
  res.json({ success: true, message: 'تم حذف الطلب' });
});

module.exports = router;
