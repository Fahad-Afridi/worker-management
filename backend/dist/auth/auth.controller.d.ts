import { AuthService } from "./auth.service";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
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
