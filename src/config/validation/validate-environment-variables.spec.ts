import { IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator';
import { validateEnvironmentVariables } from './validate-environment-variables';

class TestSchema {
    @IsString()
    @IsNotEmpty()
    HOST!: string;

    @IsNumber()
    @Min(1024)
    @Max(65535)
    PORT!: number;
}

describe('validateEnvironmentVariables', () => {
    it('returns the parsed and validated schema instance', async () => {
        const result = await validateEnvironmentVariables(TestSchema, { HOST: 'localhost', PORT: '3000' });
        expect(result).toBeInstanceOf(TestSchema);
        expect(result.HOST).toBe('localhost');
        expect(result.PORT).toBe(3000);
    });

    it('throws when a required field is missing', async () => {
        await expect(validateEnvironmentVariables(TestSchema, { PORT: '3000' })).rejects.toThrow();
    });

    it('throws when a field fails validation (port out of range)', async () => {
        await expect(validateEnvironmentVariables(TestSchema, { HOST: 'localhost', PORT: '80' })).rejects.toThrow();
    });

    it('throws when a field has the wrong type after coercion', async () => {
        await expect(
            validateEnvironmentVariables(TestSchema, { HOST: 'localhost', PORT: 'not-a-number' })
        ).rejects.toThrow();
    });
});
