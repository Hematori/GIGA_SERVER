const startBtn = document.getElementById('start-btn');
const statusBanner = document.querySelector('.status-banner');

startBtn.addEventListener('click', async () => {
    // تغيير شكل الزر والحالة مؤقتاً للإيحاء بأن العمل جاري
    statusBanner.className = 'status-banner online';
    statusBanner.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> جاري إنشاء وتشغيل السيرفر عبر Docker...';
    startBtn.style.backgroundColor = '#e67e22';
    startBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> جاري التحميل...';

    try {
        // إرسال طلب حقيقي للـ Backend لإنشاء السيرفر
        const response = await fetch('http://localhost:3000/api/create-server', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ serverId: "my-minecraft-server" }) // اسم السيرفر
        });

        const data = await response.json();

        if (response.ok) {
            statusBanner.innerHTML = `<i class="fa-solid fa-circle-check"></i> يعمل بنجاح! العنوان: ${data.address}`;
            startBtn.style.backgroundColor = '#2e7d32';
            startBtn.innerHTML = '<i class="fa-solid fa-check"></i> شغال';
            console.log("تم إنشاء السيرفر:", data);
        } else {
            throw new Error(data.error || 'حدث خطأ ما');
        }

    } catch (error) {
        console.error(error);
        statusBanner.className = 'status-banner offline';
        statusBanner.innerHTML = '<i class="fa-solid fa-circle-xmark"></i> فشل التشغيل (تأكد من تشغيل Docker)';
        startBtn.style.backgroundColor = '#d32f2f';
        startBtn.innerHTML = '<i class="fa-solid fa-power-off"></i> أعد المحاولة';
    }
});