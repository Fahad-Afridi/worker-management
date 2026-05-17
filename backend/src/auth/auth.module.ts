import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { Worker } from './worker.entity';

@Module({
    imports:[
        TypeOrmModule.forFeature([Worker]),
        JwtModule.registerAsync({
            imports:[ConfigModule],
            useFactory:(configService:ConfigService)=>({
                secret: configService.get('JWT_SECRET'),
                signOptions:{
                    expiresIn: configService.get('JWT_EXPIRES_IN',)
                },
            }),
            inject:[ConfigService],

        }),
    ],
    controllers: [AuthController],
    providers:[AuthService],
})
export class AuthModule{}