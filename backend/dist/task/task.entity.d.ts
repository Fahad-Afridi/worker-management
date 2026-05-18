import { Worker } from '../worker/worker.entity';
export declare enum TaskStatus {
    PENDING = "pending",
    IN_PROGRESS = "in-progress",
    COMPLETED = "completed"
}
export declare class Task {
    id: number;
    title: string;
    description: string;
    status: TaskStatus;
    worker: Worker;
    workerId: number;
}
