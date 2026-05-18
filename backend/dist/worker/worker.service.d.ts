import { Repository } from "typeorm";
import { Worker } from "./worker.entity";
import { CreateworkerDto } from "./dto/create-worker.dto";
import { UpdateWorkerDto } from "./dto/update-worker.dto";
export declare class WorkerService {
    private workerRepository;
    constructor(workerRepository: Repository<Worker>);
    findAll(): Promise<Worker[]>;
    findOne(id: number): Promise<Worker>;
    create(dto: CreateworkerDto): Promise<{
        id: number;
        uniqueId: string;
        name: string;
        email: string;
        country: string;
        joiningDate: Date;
        tasks: any;
    }>;
    update(id: number, dto: UpdateWorkerDto): Promise<{
        id: number;
        uniqueId: string;
        name: string;
        email: string;
        country: string;
        joiningDate: Date;
        tasks: any;
    }>;
    updateCountry(id: number, country: string): Promise<Worker>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
