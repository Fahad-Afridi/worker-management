import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { Worker } from '../worker/worker.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { EmailService } from "../mailer/mailer.service";
import { ResetPasswordDto } from './dto/reset-password.dto';
export declare class AuthService {
    private workerRepository;
    private jwtService;
    private eamilService;
    constructor(workerRepository: Repository<Worker>, jwtService: JwtService, eamilService: EmailService);
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
        worker: {
            id: number;
            uniqueId: string;
            name: string;
            email: string;
            country: string;
        };
    }>;
    forgetPassword(dto: ForgotPasswordDto): Promise<{
        message: string;
    }>;
    resetPassword(dto: ResetPasswordDto): Promise<{
        message: string;
    }>;
}
