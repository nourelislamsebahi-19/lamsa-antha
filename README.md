# 👗 لمسة أنثى — محل ملابس نسائية
**العلمة، سطيف — الجزائر**
بيع بالجملة والتجزئة | بيجامات، تيشرتات، روبة، فيزو، قندورة

---

## 🚀 تشغيل المشروع محلياً

```bash
# 1. تثبيت المكتبات
npm install

# 2. تشغيل السيرفر
npm start

# 3. افتح المتصفح
http://localhost:3000
```

---

## ☁️ Deploy على Vercel

### الطريقة 1 — Vercel CLI (أسرع)
```bash
# تثبيت Vercel CLI
npm install -g vercel

# تسجيل الدخول
vercel login

# Deploy
vercel

# Deploy للإنتاج
vercel --prod
```

### الطريقة 2 — GitHub + Vercel (موصى بها)
```
1. ارفع المشروع على GitHub:
   git init
   git add .
   git commit -m "لمسة أنثى - الإصدار الأول"
   git remote add origin https://github.com/USERNAME/lamsa-antha.git
   git push -u origin main

2. افتح vercel.com
3. اضغط "New Project"
4. اختر الـ repo من GitHub
5. اضغط Deploy ✅
```

---

## 📡 API Endpoints

| Method | Endpoint | الوصف |
|--------|----------|-------|
| GET | `/api/health` | حالة السيرفر |
| GET | `/api/products` | كل المنتجات |
| GET | `/api/products?cat=بيجامة` | فلترة بالقسم |
| GET | `/api/products?q=روبة` | بحث |
| GET | `/api/products/:id` | منتج واحد |
| POST | `/api/products` | إضافة منتج |
| PUT | `/api/products/:id` | تعديل منتج |
| DELETE | `/api/products/:id` | حذف منتج |
| GET | `/api/orders` | كل الطلبات |
| GET | `/api/orders/stats` | إحصائيات |
| POST | `/api/orders` | طلب جديد |
| PATCH | `/api/orders/:id/status` | تغيير الحالة |

---

## 🎟️ كود الترقية
```
LAMSA10  →  خصم 10%
```

---

## 🗂️ هيكل المشروع
```
lamsa-antha/
├── server.js           ← Express server
├── db.js               ← قاعدة البيانات
├── vercel.json         ← إعدادات Vercel
├── package.json
├── .gitignore
├── routes/
│   ├── products.js     ← API المنتجات
│   └── orders.js       ← API الطلبات
├── data/
│   ├── products.json   ← بيانات المنتجات
│   └── orders.json     ← الطلبات
└── public/
    └── index.html      ← الواجهة
```

---

> صُنع بـ ❤️ في العلمة، سطيف — الجزائر
