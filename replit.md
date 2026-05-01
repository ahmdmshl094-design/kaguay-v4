# بوت snfor - حمودي سان 🇸🇩

## نظرة عامة
بوت فيسبوك ماسنجر مكتوب بـ Node.js (ESM). يعمل على منصة Replit ويستخدم مكتبة `@xaviabot/fca-unofficial` للاتصال بـ Facebook.

## بنية المشروع
- **`app.js`** — نقطة البداية: يشغّل Express (منفذ 3000) + يشغّل `index.js` كعملية فرعية تعيد التشغيل تلقائيًا عند التوقف
- **`index.js`** — المنطق الرئيسي: تسجيل الدخول، تحميل الأوامر والأحداث، الاستماع للرسائل
- **`commands/`** — أوامر البوت مقسّمة حسب الفئة:
  - `AAIBox/` — أوامر متنوعة وترفيهية
  - `Admin/` — أوامر المسؤول
  - `Box/` — أوامر المجموعة
  - `Economy/` — أوامر الاقتصاد
  - `Game/` — ألعاب وترفيه
  - `Media/` — وسائط وتحميل
  - `other/` — أوامر متفرقة
  - `Utility/` — أدوات مساعدة
- **`event/`** — معالجات الأحداث (انضمام، مغادرة، تحديث المجموعة)
- **`handler/handlers.js`** — معالج الأوامر والردود والتفاعلات
- **`listen/listen.js`** — نقطة دخول الأحداث
- **`middleware/`** — تحميل الأوامر والأحداث
- **`database/`** — قاعدة بيانات JSON: مستخدمون ومجموعات
- **`KaguyaSetUp/config.js`** — الإعدادات الرئيسية
- **`KaguyaSetUp/KaguyaState.json`** — حالة جلسة فيسبوك (AppState)

## تشغيل البوت
```
node app.js
```
(الـ workflow مُعدّ تلقائيًا)

## الحزم المثبتة
- `@xaviabot/fca-unofficial` — واجهة برمجة فيسبوك
- `express` — خادم HTTP للإبقاء على التطبيق نشطًا
- `axios` — طلبات HTTP
- `jimp` (v1.x) — معالجة الصور (يستخدم named import: `import { Jimp } from 'jimp'`)
- `moment-timezone` — تنسيق الوقت
- `mongoose` — قاعدة بيانات MongoDB (اختياري)
- `chokidar` — مراقبة ملفات JSON
- `gradient-string`, `chalk` — تلوين وحدة التحكم
- `semver` — مقارنة الإصدارات
- `node-notifier` — إشعارات النظام
- `srod-v2`, `weather-js`, `node-fetch`, `pastebin-js`, `tinyurl` — حزم الأوامر

## ملاحظات مهمة
- جميع رسائل النظام باللغة العربية
- `jimp` v1.x يستخدم named exports: `import { Jimp } from 'jimp'` و `img.write()` بدلًا من `img.writeAsync()`
- البوت يعيد تشغيل نفسه تلقائيًا إذا تعطّل عبر `app.js`
- جلسة فيسبوك تُخزّن في `KaguyaSetUp/KaguyaState.json`
