/// <reference types="vitest/config" />
import { readFile, writeFile } from 'fs/promises';
import { defineConfig, Plugin } from 'vite';
import dtsPlugin from 'vite-plugin-dts';
import { viteStaticCopy } from 'vite-plugin-static-copy';

function generatePackageJson(outDir: string): Plugin {
    return {
        name: 'generate-package-json',
        async closeBundle() {
            const raw = await readFile('./package.json', 'utf-8');
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { scripts, packageManager, devEngines, publishConfig, devDependencies, ...rest } = JSON.parse(raw);

            const distPkg = {
                ...rest,
                exports: { '.': { import: './index.js', require: './index.cjs', types: './index.d.ts' } },
                main: './index.cjs',
                module: './index.js',
                types: './index.d.ts',
            };

            await writeFile(`${outDir}/package.json`, JSON.stringify(distPkg, null, 2) + '\n');
        },
    };
}

const outDir = './dist/shared-backend';
const isCI = Boolean(process.env['CI']);

export default defineConfig(({ mode: mode }) => {
    const isProduction = mode === 'production';

    return {
        build: {
            emptyOutDir: true,
            lib: {
                entry: './src/index.ts',
                fileName: 'index',
                formats: ['es', 'cjs'],
            },
            minify: isProduction,
            outDir: outDir,
            sourcemap: !isProduction,
            rollupOptions: {
                external: [
                    /^@nestjs\//,
                    /^@fastify\//,
                    /^@prisma\//,
                    'fastify',
                    'mariadb',
                    'rxjs',
                    'reflect-metadata',
                    'class-transformer',
                    'class-validator',
                    '@dnd-mapp/shared-utils',
                    'fs/promises',
                ],
            },
        },
        plugins: [
            generatePackageJson(outDir),
            dtsPlugin({ rollupTypes: true, tsconfigPath: './tsconfig.json' }),
            viteStaticCopy({
                targets: [
                    { src: 'src/README.md', dest: '.', rename: { stripBase: true } },
                    { src: 'LICENSE', dest: '.' },
                ],
            }),
        ],
        resolve: {
            tsconfigPaths: true,
        },
        root: __dirname,
        test: {
            clearMocks: true,
            coverage: {
                enabled: true,
                exclude: ['*.module.ts', 'src/index.ts', '**/index.ts', '**/test/**/*.ts'],
                include: ['src/**/*.ts'],
                provider: 'v8',
                reporter: [['html', { subdir: '.' }], 'text-summary'],
                reportOnFailure: true,
                reportsDirectory: 'coverage/shared-backend',
                // thresholds: {
                //     branches: 80,
                //     functions: 80,
                //     lines: 80,
                //     statements: 80,
                // }
            },
            environment: 'node',
            globals: true,
            include: ['src/**/*.spec.ts'],
            name: 'shared-backend',
            passWithNoTests: true,
            reporters: [
                'dot',
                ['html', { outputFile: 'reports/shared-backend/index.html' }],
                ...(isCI ? ['github-actions'] : []),
            ],
            setupFiles: ['reflect-metadata'],
            typecheck: {
                tsconfig: './tsconfig.spec.json',
            },
            sequence: {
                shuffle: true,
            },
            uiBase: '/shared-backend/',
        },
    };
});
