import { Injectable,NotFoundException,ConflictException } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Worker } from "./worker.entity";
import { CreateworkerDto } from "./dto/create-worker.dto";
import { UpdateWorkerDto } from "./dto/update-worker.dto";
import * as bcrypt from 'bcryptjs';
import { EmailService } from "src/mailer/mailer.service";


@Injectable()
export class WorkerService{
    constructor(
        @InjectRepository(Worker)
        private workerRepository: Repository<Worker>,
        private emailService: EmailService,
    ){}

    async findAll(){
        return this.workerRepository.find();
    }

    async findOne(id: number){
        const worker = await this.workerRepository.findOne({
            where: {id},
        });

        if(!worker){
            throw new NotFoundException(`Worker with is ${id} not found `)
        }
        return worker;
    }

    async create (dto: CreateworkerDto){
        const existing = await this.workerRepository.findOne({
            where : { email: dto.email},
        });
        if(existing){
            throw new ConflictException('Email already exist');
        }
        const hashedPassword = await bcrypt.hash (dto.password, 12);

        const worker = this.workerRepository.create({
            ...dto,
            password: hashedPassword,
        });

        await this . workerRepository.save(worker);

        await this.emailService.sendwelcomeEmail(worker.name, worker.email);

        const{password, ...result } = worker;
        return result ;

    }

    async update (id: number, dto: UpdateWorkerDto){
        const worker = await this. findOne(id);

        if (dto.password){
            dto.password = await bcrypt.hash(dto.password,12);
        }
        Object.assign(worker,dto);
        await this.workerRepository.save(worker);

        const {password, ...result}= worker;
        return result;
    }

    async updateCountry(id: number, country: string){
        const worker = await this.findOne(id);
        worker.country = country;
        await this.workerRepository.save(worker);
        return worker;
    }

    async remove (id: number){
        const worker = await this.findOne(id);
        await this. workerRepository.remove(worker);
        return { message: `Worker ${worker.name} deleted successfully`};
        }

}