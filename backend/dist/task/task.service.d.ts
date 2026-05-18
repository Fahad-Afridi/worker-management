import { Repository } from "typeorm";
import { Task } from "./task.entity";
import { CreateTaskDto } from "./dto/create-task.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";
export declare class TaskService {
    private taskRepository;
    constructor(taskRepository: Repository<Task>);
    create(dto: CreateTaskDto): Promise<Task>;
    findOne(id: number): Promise<Task>;
    findByWorker(workerId: number): Promise<Task[]>;
    update(id: number, dto: UpdateTaskDto): Promise<Task>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
