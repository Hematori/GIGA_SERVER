FROM node:18-alpine

# تحديث مستودعات Alpine وتثبيت Java 17 بشكل صحيح
RUN apk update && apk add --no-cache openjdk17

# إنشاء مجلد العمل داخل الحاوية
WORKDIR /app

# نسخ ملفات الاعتماديات وتثبيتها
COPY package*.json ./
RUN npm install

# نسخ باقي ملفات المشروع
COPY . .

# فتح المنفذ المطلوب
EXPOSE 3000

# أمر تشغيل التطبيق
CMD ["node", "app.js"]