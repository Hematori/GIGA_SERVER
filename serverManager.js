const Docker = require('dockerode');
const docker = new Docker({ socketPath: '//./pipe/docker_engine' }); // لو كنت تستخدم ويندوز (أو استخدم الافتراضي في لينكس)

class ServerEngine {
    
    // دالة لإنشاء وتشغيل سيرفر ماينكرافت داخل حاوية Docker معزولة
    static async createAndStartServer(serverId, hostPort) {
        try {
            console.log(`جاري سحب صورة ماينكرافت وإنشاء السيرفر ${serverId}...`);

            // سنستخدم صورة خفيفه وجاهزة لسيرفرات ماينكرافت (مثل ITZG Minecraft Server)
            const container = await docker.createContainer({
                Image: 'itzg/minecraft-server',
                name: `mc_${serverId}`,
                Env: [
                    'EULA=TRUE',
                    'TYPE=PAPER', // نوع السيرفر (Paper, Spigot, Vanilla...)
                    'VERSION=1.20.1' // إصدار ماينكرافت
                ],
                HostConfig: {
                    PortBindings: {
                        '25565/tcp': [{ HostPort: hostPort.toString() }] // ربط بورت السيرفر ببورت الجهاز
                    },
                    Memory: 2 * 1024 * 1024 * 1024, // تخصيص 2 جيجابايت رام كحد maximum
                },
                ExposedPorts: {
                    '25565/tcp': {}
                }
            });

            // تشغيل الحاوية فور إنشائها
            await container.start();
            console.log(`تم تشغيل السيرفر بنجاح! متوفر الآن على البورت: ${hostPort}`);
            
            return { success: true, containerId: container.id, port: hostPort };

        } catch (error) {
            console.error('حدث خطأ أثناء تشغيل سيرفر Docker:', error);
            return { success: false, error: error.message };
        }
    }
}

module.exports = ServerEngine;
const ServerEngine = require('./serverManager');