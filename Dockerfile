# استخدام بيئة Node.js مع بيئة تشغيل جافا لكي يعمل السيرفر
FROM node:18-alpine

# تثبيت جافا لأن سيرفرات ماينكرافت تحتاجها
RUN apk add --no-cache openjdk17-jre-current

# إنشاء مجلد العمل داخل السحابة
WORKDIR /app

# نسخ ملفات المشروع وتثبيت الحزم
COPY package*.json ./
RUN npm install

# نسخ باقي الملفات
COPY . .

# فتح المنفذ الذي ستستخدمه المنصة
EXPOSE 3000

# أمر تشغيل التطبيق
CMD ["node", "app.js"]