import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { Worker } from '../worker/worker.entity';
import { PassportModule } from "@nestjs/passport";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { MailerModule } from "../mailer/mailer.module";

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
        MailerModule,
    ],
    controllers: [AuthController],
    providers:[AuthService,JwtStrategy],
})
export class AuthModule{}