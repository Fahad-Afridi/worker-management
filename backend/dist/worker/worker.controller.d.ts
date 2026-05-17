import { WorkerService } from "./worker.service";
import { CreateworkerDto } from "./dto/create-worker.dto";
import { UpdateWorkerDto } from "./dto/update-worker.dto";
export declare class WorkerController {
    private workerservice;
    constructor(workerservice: WorkerService);
    findAll(): Promise<import("../auth/worker.entity").Worker[]>;
    findOne(id: number): Promise<import("../auth/worker.entity").Worker>;
    create(dto: CreateworkerDto): Promise<{
        id: number;
        uniqueId: string;
        name: string;
        email: string;
        country: string;
        joiningDate: Date;
    }>;
    update(id: number, dto: UpdateWorkerDto): Promise<{
        id: number;
        uniqueId: string;
        name: string;
        email: string;
        country: string;
        joiningDate: Date;
    }>;
    updateCountry(id: number, country: string): Promise<import("../auth/worker.entity").Worker>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
