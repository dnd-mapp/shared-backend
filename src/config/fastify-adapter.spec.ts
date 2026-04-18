import { FastifyAdapter } from '@nestjs/platform-fastify';
import { configureFastifyAdapter } from './fastify-adapter';

vi.mock('@nestjs/platform-fastify', () => ({
    FastifyAdapter: vi.fn(),
}));

vi.mock('fs/promises', () => ({
    readFile: vi.fn(),
}));

import { readFile } from 'fs/promises';

describe('configureFastifyAdapter', () => {
    const originalEnv = process.env['NODE_ENV'];

    afterEach(() => {
        process.env['NODE_ENV'] = originalEnv;
    });

    it('throws when cert/key paths are missing outside production', async () => {
        process.env['NODE_ENV'] = 'development';
        await expect(configureFastifyAdapter()).rejects.toThrow('SSL certificates paths need to be set');
    });

    it('returns an HTTP adapter without SSL in production when paths are absent', async () => {
        process.env['NODE_ENV'] = 'production';
        const result = await configureFastifyAdapter();

        expect(result.ssl).toBe(false);
        expect(result.adapter).toBeInstanceOf(FastifyAdapter);
    });

    it('returns an HTTPS adapter when cert and key paths are provided', async () => {
        vi.mocked(readFile).mockResolvedValueOnce('cert-content').mockResolvedValueOnce('key-content');
        process.env['NODE_ENV'] = 'development';

        const result = await configureFastifyAdapter('/path/to/cert.pem', '/path/to/key.pem');

        expect(result.ssl).toBe(true);
        expect(result.adapter).toBeInstanceOf(FastifyAdapter);
    });

    it('reads cert and key from the provided paths', async () => {
        vi.mocked(readFile).mockResolvedValueOnce('cert').mockResolvedValueOnce('key');
        process.env['NODE_ENV'] = 'development';

        await configureFastifyAdapter('/certs/cert.pem', '/certs/key.pem');

        expect(readFile).toHaveBeenCalledWith('/certs/cert.pem', { encoding: 'utf8' });
        expect(readFile).toHaveBeenCalledWith('/certs/key.pem', { encoding: 'utf8' });
    });
});
