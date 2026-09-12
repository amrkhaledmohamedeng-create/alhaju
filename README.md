# Hajj Offers Website — GitHub + Google Sheets

## 1) Google Sheet
أنشئ Google Sheet جديد، ثم افتح:
Extensions → Apps Script
والصق `google-apps-script/Code.gs`.

بعدها:
Deploy → New deployment → Web app
- Execute as: Me
- Who has access: Anyone

انسخ رابط الـ Web App.

## 2) ربط الموقع
افتح `app.js` واستبدل:
PASTE_GOOGLE_APPS_SCRIPT_URL_HERE
برابط Apps Script.

## 3) عروض الحج
يمكنك وضع العروض في شيت `hajj_offers` بهذه الأعمدة:
id | type | title | price | currency | installmentMonths | installment | description | active

مثال:
mayassar | حج ميسر | الحج الميسر | 120000 | جنيه | 24 | 5000 جنيه شهريًا | دفع كامل للبرنامج مع إمكانية تقسيط مبلغ 120 ألف جنيه على 24 شهر | true

tourist | حج سياحي | الحج السياحي | | | | | برنامج الحج + 5,000 دولار حسب البرنامج | true

lottery | حج القرعة | حج القرعة | | | | | اختيار البرنامج حسب المتاح | true

## 4) تسجيل العملاء
البيانات تدخل في `hajj_bookings`:
id | name | phone | governorate | hajjType | programId | notes | status | createdAt

## ملاحظة
النسخة الحالية هي MVP للواجهة والتسجيل والربط مع Google Sheets. الأسعار والتفاصيل قابلة للتعديل من الشيت.
