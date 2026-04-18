import { HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { ConfigurationNamespaces, ServerConfig } from './configs';
import { CORS_MAX_AGE } from './constants';

export interface CorsOverrides {
    allowedHeaders?: string[];
    credentials?: boolean;
    maxAge?: number;
    methods?: string[];
    optionsSuccessStatus?: number;
    origin?: string | string[] | RegExp | (string | RegExp)[];
}

export function configureCors(app: NestFastifyApplication, overrides?: CorsOverrides) {
    const configService = app.get(ConfigService<Record<string, unknown>, true>);
    const { cors } = configService.get<ServerConfig>(ConfigurationNamespaces.SERVER);

    app.enableCors({
        allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
        credentials: true,
        maxAge: CORS_MAX_AGE,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        optionsSuccessStatus: HttpStatus.NO_CONTENT,
        origin: [...cors.origins],
        ...overrides,
    });
}
