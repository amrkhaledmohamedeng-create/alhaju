# Hamsa Travel — Hajj 1448 Website

## التشغيل
1. افتح `app.js`.
2. رابط Google Apps Script موجود بالفعل في `CONFIG.API_URL`.
3. ارفع الملفات إلى GitHub Pages.
4. افتح الموقع وجرب نموذج التسجيل.

## الملفات
- `index.html` واجهة الموقع.
- `style.css` التصميم.
- `app.js` البرامج + ربط Google Sheets.
- `google-apps-script/Code.gs` الباك إند.
- `assets/programs-1448.pdf` الملف الأصلي لبرامج الحج 1448 هـ.

## Google Sheets
الباك إند يستخدم:
- `hajj_offers`
- `hajj_bookings`

إذا كانت ورقة `hajj_offers` فارغة، الموقع يستخدم البيانات المضمنة داخل `app.js` تلقائيًا.
