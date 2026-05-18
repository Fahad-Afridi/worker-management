import { TaskService } from "./task.service";
import { CreateTaskDto } from "./dto/create-task.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";
export declare class TaskController {
    private taskService;
    constructor(taskService: TaskService);
    create(dto: CreateTaskDto): Promise<import("./task.entity").Task>;
    findOne(id: number): Promise<import("./task.entity").Task>;
    findByWorker(workerId: number): Promise<import("./task.entity").Task[]>;
    update(id: number, dto: UpdateTaskDto): Promise<import("./task.entity").Task>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
