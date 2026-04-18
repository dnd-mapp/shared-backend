import { validate } from 'class-validator';
import { IsHost } from './is-host.decorator';

class TestDto {
    @IsHost()
    host!: string;
}

async function isValid(value: string) {
    const dto = Object.assign(new TestDto(), { host: value });
    const errors = await validate(dto);
    return errors.length === 0;
}

describe('IsHost', () => {
    it.each(['192.168.1.1', '10.0.0.1', '127.0.0.1', '0.0.0.0'])('accepts IPv4 address %s', async (ip) => {
        expect(await isValid(ip)).toBe(true);
    });

    it.each(['::1', '2001:db8::1'])('accepts IPv6 address %s', async (ip) => {
        expect(await isValid(ip)).toBe(true);
    });

    it.each(['example.com', 'sub.domain.co.uk', 'localhost', 'my-host'])('accepts valid hostname %s', async (host) => {
        expect(await isValid(host)).toBe(true);
    });

    it.each(['not a host', '', '999.999.999.999', 'host name with spaces'])(
        'rejects invalid value %s',
        async (value) => {
            expect(await isValid(value)).toBe(false);
        }
    );
});
