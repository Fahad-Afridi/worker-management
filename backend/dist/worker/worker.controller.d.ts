import { WorkerService } from "./worker.service";
import { CreateworkerDto } from "./dto/create-worker.dto";
import { UpdateWorkerDto } from "./dto/update-worker.dto";
export declare class WorkerController {
    private workerservice;
    constructor(workerservice: WorkerService);
    findAll(): Promise<import("./worker.entity").Worker[]>;
    findOne(id: number): Promise<import("./worker.entity").Worker>;
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
    updateCountry(id: number, country: string): Promise<import("./worker.entity").Worker>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
