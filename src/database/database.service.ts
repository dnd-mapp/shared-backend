import { Inject, Injectable, OnApplicationShutdown, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { ConfigurationNamespaces, DatabaseConfig } from '../config/configs';
import { PrismaClientCtor, PrismaClientOptions, PrismaLikeClient } from './prisma-like-client';
import { PRISMA_CLIENT, PRISMA_CLIENT_OPTIONS } from './prisma.tokens';

@Injectable()
export class DatabaseService<
    TClient extends PrismaLikeClient = PrismaLikeClient,
    TCtor extends PrismaClientCtor<TClient> = PrismaClientCtor<TClient>,
    TClientOptions extends PrismaClientOptions<TCtor> = PrismaClientOptions<TCtor>,
>
    implements OnModuleInit, OnApplicationShutdown
{
    private readonly configService: ConfigService<Record<string, unknown>, true>;
    public get prisma() {
        return this._prisma!;
    }
    private _prisma: TClient | undefined;

    private readonly Client: TCtor;
    private readonly options: TClientOptions;

    constructor(
        @Inject(PRISMA_CLIENT) Client: TCtor,
        @Inject(PRISMA_CLIENT_OPTIONS) options: TClientOptions,
        configService: ConfigService<Record<string, unknown>, true>
    ) {
        this.configService = configService;
        this.Client = Client;
        this.options = options;
    }

    public async onModuleInit() {
        await this.initializePrisma(this.Client, this.options);
    }

    public async onApplicationShutdown() {
        await this.prisma.$disconnect();
    }

    private async initializePrisma(Client: TCtor, options: TClientOptions) {
        if (this._prisma) return;
        const { host, port, schema, user, password } = this.configService.get<DatabaseConfig>(
            ConfigurationNamespaces.DATABASE
        );

        const adapter = new PrismaMariaDb({
            host,
            port,
            database: schema,
            user,
            password,
        });

        this._prisma = new Client({ adapter, ...options });
        await this._prisma.$connect();
    }
}
