import { isArrayEmpty } from '@dnd-mapp/shared-utils';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

export async function validateEnvironmentVariables<T extends object>(
    Schema: new () => T,
    variables: Record<string, string>
): Promise<T> {
    const parsedEnvironmentVariables = plainToInstance(Schema, variables, {
        enableImplicitConversion: true,
        enableCircularCheck: true,
        exposeDefaultValues: true,
    });

    const validationErrors = await validate(parsedEnvironmentVariables, {
        forbidUnknownValues: true,
        skipMissingProperties: false,
        stopAtFirstError: true,
        whitelist: true,
    });

    if (!isArrayEmpty(validationErrors)) {
        const constraints = validationErrors[0]!.constraints as Record<string, string>;
        throw new Error(Object.values(constraints)[0]);
    }

    return parsedEnvironmentVariables;
}
