/**
 * db.js — قاعدة بيانات
 * - محلياً: يقرأ ويكتب في data/*.json
 * - Vercel:  يشتغل بالـ in-memory (ما فيهاش كتابة دائمة)
 */

const fs   = require('fs');
const path = require('path');

const IS_VERCEL = process.env.VERCEL === '1';

// ── تحميل البيانات الأولية ──────────────────────────
const PRODUCTS_PATH = path.join(__dirname, 'data', 'products.json');
const ORDERS_PATH   = path.join(__dirname, 'data', 'orders.json');

let _products = JSON.parse(fs.readFileSync(PRODUCTS_PATH, 'utf8'));
let _orders   = [];

try {
  _orders = JSON.parse(fs.readFileSync(ORDERS_PATH, 'utf8'));
} catch (_) {}

// ── Products ────────────────────────────────────────
function getProducts()          { return [..._products]; }
function setProducts(data)      {
  _products = data;
  if (!IS_VERCEL) fs.writeFileSync(PRODUCTS_PATH, JSON.stringify(data, null, 2));
}
function getProductById(id)     { return _products.find(p => p.id === +id) || null; }
function saveProduct(product)   {
  const idx = _products.findIndex(p => p.id === product.id);
  if (idx === -1) _products.push(product);
  else _products[idx] = product;
  setProducts(_products);
}
function deleteProduct(id)      {
  _products = _products.filter(p => p.id !== +id);
  setProducts(_products);
}

// ── Orders ──────────────────────────────────────────
function getOrders()            { return [..._orders]; }
function getOrderById(id)       { return _orders.find(o => o.id === id) || null; }
function saveOrder(order)       {
  const idx = _orders.findIndex(o => o.id === order.id);
  if (idx === -1) _orders.push(order);
  else _orders[idx] = order;
  if (!IS_VERCEL) fs.writeFileSync(ORDERS_PATH, JSON.stringify(_orders, null, 2));
}
function deleteOrder(id)        {
  _orders = _orders.filter(o => o.id !== id);
  if (!IS_VERCEL) fs.writeFileSync(ORDERS_PATH, JSON.stringify(_orders, null, 2));
}

module.exports = {
  getProducts, setProducts, getProductById, saveProduct, deleteProduct,
  getOrders,   getOrderById, saveOrder, deleteOrder,
  IS_VERCEL,
};
