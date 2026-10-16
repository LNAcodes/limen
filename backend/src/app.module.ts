import { Module } from '@nestjs/common';
import { HealthModule } from './health/health.module.js';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThreadsModule } from './threads/threads.module.js';
import { RepliesModule } from './replies/replies.module.js';
import { CategoriesModule } from './categories/categories.module.js';
import { UsersModule } from './users/users.module.js';

@Module({
  imports: [
    HealthModule,
    ConfigModule.forRoot({ isGlobal: true }), // Loads .env and makes ConfigService available in every module
    TypeOrmModule.forRootAsync({
      // Async: wait until ConfigModule has loaded .env before building the DB config
      inject: [ConfigService],
      // Nest passes the ConfigService into the factory below
      useFactory: (configService: ConfigService) => {
        // Factory: builds the TypeORM config once everything is ready
        const databaseUrl = configService.get<string>('DATABASE_URL');
        // Read the DB connection string from .env (never hardcode credentials)

        return {
          type: 'postgres',
          url: databaseUrl,
          autoLoadEntities: true, // Register every entity from TypeOrmModule.forFeature automatically
          synchronize: true, // Dev only: creates/updates tables from entities, can delete data
        };
      },
    }),
    ThreadsModule,
    RepliesModule,
    CategoriesModule,
    UsersModule,
  ],
})
export class AppModule {}
