import { Repository } from "typeorm";
import { Worker } from "./worker.entity";
import { CreateworkerDto } from "./dto/create-worker.dto";
import { UpdateWorkerDto } from "./dto/update-worker.dto";
import { EmailService } from "../mailer/mailer.service";
export declare class WorkerService {
    private workerRepository;
    private emailService;
    constructor(workerRepository: Repository<Worker>, emailService: EmailService);
    findAll(): Promise<Worker[]>;
    findOne(id: number): Promise<Worker>;
    create(dto: CreateworkerDto): Promise<{
        id: number;
        uniqueId: string;
        name: string;
        email: string;
        country: string;
        role: import("./worker.entity").Role;
        resetToken: string | null;
        resetTokenExpiry: Date | null;
        joiningDate: Date;
        task: import("../task/task.entity").Task[];
    }>;
    update(id: number, dto: UpdateWorkerDto): Promise<{
        id: number;
        uniqueId: string;
        name: string;
        email: string;
        country: string;
        role: import("./worker.entity").Role;
        resetToken: string | null;
        resetTokenExpiry: Date | null;
        joiningDate: Date;
        task: import("../task/task.entity").Task[];
    }>;
    updateCountry(id: number, country: string): Promise<Worker>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
