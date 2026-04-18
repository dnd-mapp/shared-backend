import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';
import { createThrottlerOptions, provideAppThrottler } from './throttler';

interface Throttler {
    name: string;
    ttl: number;
    limit: number;
}

describe('createThrottlerOptions', () => {
    it('returns default 3-tier throttler config', () => {
        const { throttlers } = createThrottlerOptions() as { throttlers: Throttler[] };

        expect(throttlers).toHaveLength(3);
        expect(throttlers.map((t) => t.name)).toEqual(['short', 'medium', 'long']);
    });

    it('default short tier allows 3 requests per second', () => {
        const { throttlers } = createThrottlerOptions() as { throttlers: Throttler[] };
        const short = throttlers.find((t) => t.name === 'short');

        expect(short?.limit).toBe(3);
        expect(short?.ttl).toBe(1000);
    });

    it('default medium tier allows 20 requests per 10 seconds', () => {
        const { throttlers } = createThrottlerOptions() as { throttlers: Throttler[] };
        const medium = throttlers.find((t) => t.name === 'medium');

        expect(medium?.limit).toBe(20);
        expect(medium?.ttl).toBe(10_000);
    });

    it('default long tier allows 100 requests per minute', () => {
        const { throttlers } = createThrottlerOptions() as { throttlers: Throttler[] };
        const long = throttlers.find((t) => t.name === 'long');

        expect(long?.limit).toBe(100);
        expect(long?.ttl).toBe(60_000);
    });

    it('applies top-level overrides', () => {
        const { errorMessage } = createThrottlerOptions({ errorMessage: 'rate limited' }) as { errorMessage: string };
        expect(errorMessage).toBe('rate limited');
    });

    it('overrides replace throttlers array when provided', () => {
        const custom = [{ name: 'custom', ttl: 5000, limit: 10 }];

        const { throttlers } = createThrottlerOptions({ throttlers: custom }) as { throttlers: Throttler[] };
        expect(throttlers).toEqual(custom);
    });
});

describe('provideAppThrottler', () => {
    it('returns a provider bound to APP_GUARD using ThrottlerGuard', () => {
        const provider = provideAppThrottler();
        expect(provider.provide).toBe(APP_GUARD);
        expect(provider.useClass).toBe(ThrottlerGuard);
    });
});
