import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Worker } from './worker/worker.entity';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guards';
import { WorkerModule } from './worker/worker.module';
import { TaskModule } from './task/task.module';
import { Task } from './task/task.entity';
import { RolesGuard } from './auth/guards/roles.guards';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: parseInt(configService.get('DB_PORT') ?? '5432'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: [Worker,Task],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    WorkerModule,
    TaskModule,
  ],
  providers:[
    {
      provide : APP_GUARD,
      useClass : JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass:RolesGuard,
    },
  ],
})
export class AppModule {}