import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { ConfigurationNamespaces } from '../config';
import { DatabaseService } from './database.service';
import { PRISMA_CLIENT, PRISMA_CLIENT_OPTIONS } from './prisma.tokens';

const mockConnect = vi.fn().mockResolvedValue(undefined);
const mockDisconnect = vi.fn().mockResolvedValue(undefined);

const MockPrismaClient = vi.fn().mockImplementation(function () {
    return { $connect: mockConnect, $disconnect: mockDisconnect };
});

vi.mock('@prisma/adapter-mariadb', () => ({
    PrismaMariaDb: vi.fn().mockImplementation(function () {
        return {};
    }),
}));

const mockDatabaseConfig = {
    host: 'localhost',
    port: 3306,
    schema: 'test_db',
    user: 'root',
    password: 'secret',
};

describe('DatabaseService', () => {
    let service: DatabaseService;

    beforeEach(async () => {
        vi.clearAllMocks();

        const module = await Test.createTestingModule({
            providers: [
                DatabaseService,
                {
                    provide: PRISMA_CLIENT,
                    useValue: MockPrismaClient,
                },
                {
                    provide: PRISMA_CLIENT_OPTIONS,
                    useValue: {},
                },
                {
                    provide: ConfigService,
                    useValue: {
                        get: vi.fn().mockImplementation((key: string) => {
                            if (key === ConfigurationNamespaces.DATABASE) return mockDatabaseConfig;
                            return undefined;
                        }),
                    },
                },
            ],
        }).compile();

        service = module.get(DatabaseService);
    });

    it('calls $connect on module init', async () => {
        await service.onModuleInit();
        expect(mockConnect).toHaveBeenCalledOnce();
    });

    it('does not reinitialize prisma on repeated onModuleInit calls', async () => {
        await service.onModuleInit();
        await service.onModuleInit();
        expect(MockPrismaClient).toHaveBeenCalledOnce();
    });

    it('calls $disconnect on application shutdown', async () => {
        await service.onModuleInit();
        await service.onApplicationShutdown();
        expect(mockDisconnect).toHaveBeenCalledOnce();
    });
});
