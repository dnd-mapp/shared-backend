import { FastifyAdapter } from '@nestjs/platform-fastify';
import { readFile } from 'fs/promises';

export async function configureFastifyAdapter(
    sslCertPath?: string,
    sslKeyPath?: string
): Promise<{ adapter: FastifyAdapter; ssl: boolean }> {
    if (!sslCertPath || !sslKeyPath) {
        if (process.env['NODE_ENV'] !== 'production') {
            throw new Error('SSL certificates paths need to be set');
        }
        return {
            adapter: new FastifyAdapter(),
            ssl: false,
        };
    }

    const sslCert = await readFile(sslCertPath, { encoding: 'utf8' });
    const sslKey = await readFile(sslKeyPath, { encoding: 'utf8' });

    if (process.env['NODE_ENV'] !== 'production' && (!sslCert || !sslKey)) {
        throw new Error('SSL certificates are missing');
    }

    return {
        adapter: new FastifyAdapter({ https: { cert: sslCert, key: sslKey } }),
        ssl: true,
    };
}
