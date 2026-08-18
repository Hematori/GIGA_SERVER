const express = require('express');
const { spawn } = require('child_process');
const path = require('path');
const app = express();
const PORT = process.mainModule ? 3000 : 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public'))); // وضع ملفات الـ HTML والـ CSS في مجلد باسم public

let serverProcess = null;
let serverStatus = "Offline";

// API لمعرفة حالة السيرفر
app.get('/api/status', (req, res) => {
    res.json({ status: serverStatus });
});

// API لتشغيل السيرفر
app.post('/api/start', (req, res) => {
    if (serverProcess) {
        return res.json({ success: false, message: "السيرفر يعمل بالفعل!" });
    }

    console.log("جاري تشغيل سيرفر ماينكرافت...");
    serverStatus = "Starting";

    // هنا يتم تشغيل ملف السيرفر الحقيقي (تأكد من مسار الـ java ومجلد السيرفر)
    // يمكنك استبدال المسارات بملفات سيرفرك الفعلي
    serverProcess = spawn('java', ['-Xmx1024M', '-Xms1024M', '-jar', 'server.jar', 'nogui'], {
        cwd: path.join(__dirname, 'minecraft_server') // مجلد ملفات سيرفر ماينكرافت
    });

    serverProcess.stdout.on('data', (data) => {
        console.log(`[MC Server]: ${data}`);
        if (data.toString().includes('Done')) {
            serverStatus = "Online";
        }
    });

    serverProcess.stderr.on('data', (data) => {
        console.error(`[MC Error]: ${data}`);
    });

    serverProcess.on('close', (code) => {
        console.log(`توقف السيرفر برمز: ${code}`);
        serverStatus = "Offline";
        serverProcess = null;
    });

    res.json({ success: true, message: "تم إرسال أمر التشغيل بنجاح!" });
});

app.listen(3000, () => {
    console.log('لوحة التحكم تعمل على الرابط: http://localhost:3000');
});