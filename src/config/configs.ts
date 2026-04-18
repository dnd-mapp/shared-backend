export const ConfigurationNamespaces = {
    SERVER: 'server',
    DATABASE: 'database',
} as const;

export type ConfigurationNamespace = (typeof ConfigurationNamespaces)[keyof typeof ConfigurationNamespaces];

interface CorsConfig {
    origins: string[];
}

export interface SslConfig {
    cert?: string;
    key?: string;
}

export interface ServerConfig {
    host: string;
    port: number;
    cors: CorsConfig;
    ssl: SslConfig;
}

export interface DatabaseConfig {
    host: string;
    port: number;
    schema: string;
    user: string;
    password: string;
}

export interface SharedBackendConfig {
    [ConfigurationNamespaces.SERVER]: ServerConfig;
    [ConfigurationNamespaces.DATABASE]: DatabaseConfig;
}
