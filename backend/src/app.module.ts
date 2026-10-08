import { Module } from '@nestjs/common';
import { HealthModule } from './health/health.module.js';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [HealthModule, ConfigModule.forRoot({ isGlobal: true })],
})
export class AppModule {}
