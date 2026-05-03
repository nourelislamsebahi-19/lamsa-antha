const express = require('express');
const router  = express.Router();
const db      = require('../db');

// GET /api/products
router.get('/', (req, res) => {
  let products = db.getProducts();
  const { cat, q, badge } = req.query;
  if (cat && cat !== 'all') products = products.filter(p => p.cat === cat);
  if (badge)                products = products.filter(p => p.badge === badge);
  if (q)                    products = products.filter(p =>
    p.name.includes(q) || p.cat.includes(q)
  );
  res.json({ success: true, count: products.length, data: products });
});

// GET /api/products/:id
router.get('/:id', (req, res) => {
  const product = db.getProductById(req.params.id);
  if (!product) return res.status(404).json({ success: false, message: 'المنتج غير موجود' });
  res.json({ success: true, data: product });
});

// POST /api/products
router.post('/', (req, res) => {
  const products = db.getProducts();
  const newProduct = {
    id:          products.length ? Math.max(...products.map(p => p.id)) + 1 : 1,
    name:        req.body.name        || 'منتج جديد',
    cat:         req.body.cat         || 'تيشرت',
    icon:        req.body.icon        || '👚',
    badge:       req.body.badge       || null,
    price:       +req.body.price      || 0,
    salePrice:   req.body.salePrice   ? +req.body.salePrice : null,
    sizes:       req.body.sizes       || ['M','L'],
    colors:      req.body.colors      || ['#ffffff'],
    stock:       +req.body.stock      || 0,
    description: req.body.description || '',
  };
  db.saveProduct(newProduct);
  res.status(201).json({ success: true, data: newProduct });
});

// PUT /api/products/:id
router.put('/:id', (req, res) => {
  const product = db.getProductById(req.params.id);
  if (!product) return res.status(404).json({ success: false, message: 'المنتج غير موجود' });
  const updated = { ...product, ...req.body, id: product.id };
  db.saveProduct(updated);
  res.json({ success: true, data: updated });
});

// DELETE /api/products/:id
router.delete('/:id', (req, res) => {
  const product = db.getProductById(req.params.id);
  if (!product) return res.status(404).json({ success: false, message: 'المنتج غير موجود' });
  db.deleteProduct(req.params.id);
  res.json({ success: true, message: 'تم حذف المنتج' });
});

// PATCH /api/products/:id/stock
router.patch('/:id/stock', (req, res) => {
  const product = db.getProductById(req.params.id);
  if (!product) return res.status(404).json({ success: false, message: 'المنتج غير موجود' });
  const updated = { ...product, stock: +req.body.stock };
  db.saveProduct(updated);
  res.json({ success: true, data: updated });
});

module.exports = router;
