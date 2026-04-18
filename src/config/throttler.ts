import { convertTime, TimeUnits } from '@dnd-mapp/shared-utils';
import { ClassProvider } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModuleOptions } from '@nestjs/throttler';

export function createThrottlerOptions(overrides?: Partial<ThrottlerModuleOptions>): ThrottlerModuleOptions {
    return {
        throttlers: [
            {
                name: 'short',
                ttl: convertTime(1, TimeUnits.SECONDS),
                limit: 3,
            },
            {
                name: 'medium',
                ttl: convertTime(10, TimeUnits.SECONDS),
                limit: 20,
            },
            {
                name: 'long',
                ttl: convertTime(1, TimeUnits.MINUTES),
                limit: 100,
            },
        ],
        ...overrides,
    };
}

export function provideAppThrottler(): ClassProvider {
    return {
        provide: APP_GUARD,
        useClass: ThrottlerGuard,
    };
}
