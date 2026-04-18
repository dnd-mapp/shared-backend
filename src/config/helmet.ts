import fastifyHelmet from '@fastify/helmet';
import { NestFastifyApplication } from '@nestjs/platform-fastify';

type CspDirectives = Record<string, string[]>;

export interface HelmetOverrides {
    contentSecurityPolicy?: {
        directives?: CspDirectives;
    };
    [key: string]: unknown;
}

function mergeCspDirectives(base: CspDirectives, overrides: CspDirectives): CspDirectives {
    const merged: CspDirectives = { ...base };
    for (const [key, value] of Object.entries(overrides)) {
        merged[key] = value;
    }
    return merged;
}

export async function configureHelmet(app: NestFastifyApplication, overrides?: HelmetOverrides) {
    const defaultDirectives: CspDirectives = {
        defaultSrc: [`'self'`],
        styleSrc: [`'self'`, `'unsafe-inline'`],
        imgSrc: [`'self'`, 'data:', 'validator.swagger.io'],
        scriptSrc: [`'self'`, `https: 'unsafe-inline'`],
    };

    const mergedDirectives =
        overrides?.contentSecurityPolicy?.directives !== undefined
            ? mergeCspDirectives(defaultDirectives, overrides.contentSecurityPolicy.directives)
            : defaultDirectives;

    const { contentSecurityPolicy: _csp, ...restOverrides } = overrides ?? {};

    await app.register(fastifyHelmet, {
        contentSecurityPolicy: {
            directives: mergedDirectives,
        },
        ...restOverrides,
    });
}
