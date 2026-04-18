import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { configureHelmet } from './helmet';

vi.mock('@fastify/helmet', () => ({ default: vi.fn() }));

import fastifyHelmet from '@fastify/helmet';

function mockApp(): NestFastifyApplication {
    return {
        register: vi.fn().mockResolvedValue(undefined),
    } as unknown as NestFastifyApplication;
}

describe('configureHelmet', () => {
    let app: NestFastifyApplication;

    beforeEach(() => {
        app = mockApp();
        vi.clearAllMocks();
    });

    it('registers helmet with default CSP directives', async () => {
        await configureHelmet(app);

        expect(app.register).toHaveBeenCalledWith(
            fastifyHelmet,
            expect.objectContaining({
                contentSecurityPolicy: {
                    directives: expect.objectContaining({
                        defaultSrc: [`'self'`],
                        styleSrc: [`'self'`, `'unsafe-inline'`],
                    }) as unknown,
                },
            })
        );
    });

    it('merges override CSP directives with defaults', async () => {
        await configureHelmet(app, {
            contentSecurityPolicy: { directives: { connectSrc: [`'self'`, 'https://api.example.com'] } },
        });

        expect(app.register).toHaveBeenCalledWith(
            fastifyHelmet,
            expect.objectContaining({
                contentSecurityPolicy: {
                    directives: expect.objectContaining({
                        defaultSrc: [`'self'`],
                        connectSrc: [`'self'`, 'https://api.example.com'],
                    }) as unknown,
                },
            })
        );
    });

    it('allows an override to replace an existing CSP directive', async () => {
        await configureHelmet(app, {
            contentSecurityPolicy: { directives: { scriptSrc: [`'self'`] } },
        });

        const call = vi.mocked(app.register).mock.calls[0];
        const options = call?.[1] as { contentSecurityPolicy: { directives: Record<string, string[]> } };
        expect(options.contentSecurityPolicy.directives['scriptSrc']).toEqual([`'self'`]);
    });

    it('passes extra top-level helmet options through', async () => {
        await configureHelmet(app, { crossOriginEmbedderPolicy: false });

        expect(app.register).toHaveBeenCalledWith(
            fastifyHelmet,
            expect.objectContaining({ crossOriginEmbedderPolicy: false })
        );
    });
});
