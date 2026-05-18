import { WorkerService } from "./worker.service";
import { CreateworkerDto } from "./dto/create-worker.dto";
import { UpdateWorkerDto } from "./dto/update-worker.dto";
import { Role } from "./worker.entity";
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
        role: Role;
        joiningDate: Date;
        task: import("../task/task.entity").Task[];
    }>;
    update(id: number, dto: UpdateWorkerDto): Promise<{
        id: number;
        uniqueId: string;
        name: string;
        email: string;
        country: string;
        role: Role;
        joiningDate: Date;
        task: import("../task/task.entity").Task[];
    }>;
    updateCountry(id: number, country: string): Promise<import("./worker.entity").Worker>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
