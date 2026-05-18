import { Controller, Post, Body } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { Public } from "./decorator/public.decorator";
import { Role } from "src/worker/worker.entity";
import { Roles } from "./decorator/roles.decorator";

@Controller('auth')
export class AuthController{
    constructor( private authService : AuthService){}

  
    @Roles(Role.ADMIN)
    @Post('register')
    register(@Body() dto:RegisterDto){
        return this.authService.register(dto);
    }
    @Public()
    @Post('login')
    login(@Body() dto: LoginDto){
        return this.authService.login(dto);
    }
}