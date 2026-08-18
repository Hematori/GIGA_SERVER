const express = require('express');
const ServerEngine = require('./serverEngine'); // استدعاء الكود السابق
const app = express();
app.use(express.json());

// قائمة بسيطة لتتبع البورتات المستخدمة (في المشاريع الكبيرة نستخدم قاعدة بيانات)
let currentPort = 25565;

app.post('/api/create-server', async (req, res) => {
    const { serverId } = req.body;
    const portToUse = currentPort++; // إعطاء بورت جديد لكل سيرفر

    console.log(`طلب جديد لإنشاء سيرفر: ${serverId} على البورت: ${portToUse}`);

    const result = await ServerEngine.createAndStartServer(serverId, portToUse);

    if (result.success) {
        res.json({
            message: "تم إنشاء السيرفر بنجاح!",
            address: `localhost:${portToUse}`,
            serverId: serverId
        });
    } else {
        res.status(500).json({ error: "فشل إنشاء السيرفر", details: result.error });
    }
});

app.listen(3000, () => {
    console.log('API التحكم يعمل على الرابط: http://localhost:3000');
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`اللوحة تعمل على المنفذ: ${PORT}`);
});
const cors = require('cors');
app.use(cors());