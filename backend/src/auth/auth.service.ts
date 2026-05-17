import { Injectable , ConflictException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { Worker } from './worker.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class Authservice{

    constructor(
        @InjectRepository(Worker)
        private workerRepository : Repository<Worker>,
        private jwtService : JwtService,
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
        .addSelect('woekwe.password')
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
 
}