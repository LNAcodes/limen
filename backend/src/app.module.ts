import { Module } from '@nestjs/common';
import { HealthModule } from './health/health.module.js';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThreadsModule } from './threads/threads.module.js';

@Module({
  imports: [
    HealthModule,
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const databaseUrl = configService.get<string>('DATABASE_URL');
        return {
          type: 'postgres',
          url: databaseUrl,
          autoLoadEntities: true,
          synchronize: true,
        };
      },
    }),
    ThreadsModule,
  ],
})
export class AppModule {}
