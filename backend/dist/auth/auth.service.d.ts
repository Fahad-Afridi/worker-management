import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { Worker } from './worker.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class Authservice {
    private workerRepository;
    private jwtService;
    constructor(workerRepository: Repository<Worker>, jwtService: JwtService);
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
}
