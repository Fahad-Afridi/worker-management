import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { Role, Worker } from '../worker/worker.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { EmailService } from "../mailer/mailer.service";
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ConfigService } from '@nestjs/config';
export declare class AuthService {
    private workerRepository;
    private jwtService;
    private emailService;
    private configService;
    constructor(workerRepository: Repository<Worker>, jwtService: JwtService, emailService: EmailService, configService: ConfigService);
    register(dto: RegisterDto): Promise<{
        message: string;
        worker: {
            id: number;
            uniqueId: string;
            name: string;
            email: string;
            country: string;
        };
    }>;
    login(dto: LoginDto): Promise<{
        access_token: string;
        refresh_token: string;
        worker: {
            id: number;
            uniqueId: string;
            name: string;
            email: string;
            country: string;
            role: Role;
        };
    }>;
    forgetPassword(dto: ForgotPasswordDto): Promise<{
        message: string;
    }>;
    resetPassword(dto: ResetPasswordDto): Promise<{
        message: string;
    }>;
}
