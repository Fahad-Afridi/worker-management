import { Injectable , ConflictException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import { Role, Worker } from '../worker/worker.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { EmailService } from 'src/mailer/mailer.service';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class AuthService{

    constructor(
        @InjectRepository(Worker)
        private workerRepository : Repository<Worker>,
        private jwtService : JwtService,
        private emailService: EmailService,
        private configService: ConfigService,
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
            email: worker.email,
            role:worker.role,
        };

       // const token = this.jwtService.sign(payload);

      /* const access_token = this.jwtService.sign(payload, {
        secret: process.env.JWT_SECRET,
        expiresIn: process.env.JWT_EXPIRES_IN,
      });

       const refresh_token = this.jwtService.sign(payload,{
        secret: process.env.JWT_SECRET,
        expiresIn:'7d'
       });
       */
      const access_token = this.jwtService.sign(payload);

      const refresh_token = this.jwtService.sign(payload,{
        secret: this.configService.get('JWT_REFRESH_SECRET'),
        expiresIn:'7d',
      });


        return {
            access_token,
            refresh_token,
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

        await this.emailService.sendPasswordResetEmail(
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