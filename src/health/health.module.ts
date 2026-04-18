import { DynamicModule, Module, Type } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { DatabaseModule } from '../database';

@Module({})
export class HealthModule {
    public static forRoot(...controllers: Type[]): DynamicModule {
        return {
            module: HealthModule,
            imports: [TerminusModule, DatabaseModule],
            controllers: [...controllers],
        };
    }
}
