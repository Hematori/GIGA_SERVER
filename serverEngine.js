const Docker = require('dockerode');
const docker = new Docker({ socketPath: '//./pipe/docker_engine' });

class ServerEngine {
    static async createAndStartServer(serverId, hostPort) {
        try {
            const container = await docker.createContainer({
                Image: 'itzg/minecraft-server',
                name: `mc_${serverId}`,
                Env: [
                    'EULA=TRUE',
                    'TYPE=PAPER',
                    'VERSION=1.20.1'
                ],
                HostConfig: {
                    PortBindings: {
                        '25565/tcp': [{ HostPort: hostPort.toString() }]
                    },
                    Memory: 2 * 1024 * 1024 * 1024,
                },
                ExposedPorts: {
                    '25565/tcp': {}
                }
            });

            await container.start();
            return { success: true, containerId: container.id, port: hostPort };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}

module.exports = ServerEngine;
