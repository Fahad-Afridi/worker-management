import { Injectable , ConflictException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import { Worker } from '../worker/worker.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { EmailService } from 'src/mailer/mailer.service';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Injectable()
export class AuthService{

    constructor(
        @InjectRepository(Worker)
        private workerRepository : Repository<Worker>,
        private jwtService : JwtService,
        private eamilService: EmailService,
    ){}

    async register (dto : RegisterDto){
        const existing = await this.workerRepository.findOne({
            where : {email: dto.email},
        });

        if(existing){
            throw new ConflictException('Email already registered');
        }
        
        const hashedPassword = await bcrypt.hash(dto.password,12);

        const worker = this.workerRepository.create({
            name : dto.name,
            email : dto.email,
            password : hashedPassword,
            country : dto.country,
        });

        await this.workerRepository.save(worker);

        return{
            message : 'Registration successful',
            worker: {
                id: worker.id,
                uniqueId : worker.uniqueId,
                name : worker.name,
                email : worker.email,
                country : worker.country,
            },
        };
    
    }

    async login(dto:LoginDto){
        const worker = await this.workerRepository
        .createQueryBuilder('worker')
        .where('worker.email = :email',{email:dto.email})
        .addSelect('worker.password')
        .getOne();

        if (!worker){
            throw new UnauthorizedException('Invalid Credentials');
        }
        const passwordMatch =  await bcrypt.compare(dto.password, worker.password);

        if(!passwordMatch){
            throw new UnauthorizedException('Invalid Credentials');
        }
        const payload = {
            sub : worker.id,
            email: worker.email
        };
        const token = this.jwtService.sign(payload);

        return {
            access_token : token,
            worker:{
                id : worker.id,
                uniqueId: worker.uniqueId,
                name : worker.name,
                email: worker.email,
                country : worker.country,
            },
        };
    }
    async forgetPassword (dto: ForgotPasswordDto){
        const worker = await this.workerRepository.findOne({
            where: {email: dto.email},
        });
        if (!worker){
            return{
                message: 'If this eamil exists you will receive a reset link',
            };   
        }
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpiry = new Date(Date.now() + 15 * 60 * 1000);

        worker.resetToken = resetToken;
        worker.resetTokenExpiry = resetTokenExpiry;
        await this.workerRepository.save(worker);

        await this.eamilService.sendPasswordResetEmail(
            worker.name,
            worker.email,
            resetToken,
        );
        return{
            message: 'If this eamil exists you will recive a reset link',
        };
    }

    async resetPassword(dto: ResetPasswordDto){
        const worker = await this.workerRepository
        .createQueryBuilder('worker')
        .where('worker.resetToken = :token',{ token: dto.token})
        .addSelect('worker.resetToken')
        .getOne();

    if(!worker){
        throw new BadRequestException('Invalid reset token');
    }

    const now = new Date();
    if (!worker.resetTokenExpiry ||worker.resetTokenExpiry < now){
        worker.resetToken = null;
        worker.resetTokenExpiry = null;
        await this.workerRepository.save(worker);
        throw new BadRequestException('Reset token has expired');
    }
    const hashedPassword = await bcrypt.hash(dto.newPassword,12);

    worker.password = hashedPassword;
    worker.resetToken = null;
    worker.resetTokenExpiry = null;
    await this.workerRepository.save(worker);

    return{
        message: 'Password reset successful. You can now login.',
    };

    }
 
}