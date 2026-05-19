import { Task } from "../task/task.entity";
export declare enum Role {
    WORKER = "worker",
    ADMIN = "admin"
}
export declare class Worker {
    id: number;
    uniqueId: string;
    name: string;
    email: string;
    password: string;
    country: string;
    role: Role;
    resetToken: string | null;
    resetTokenExpiry: Date | null;
    joiningDate: Date;
    task: Task[];
    generateUniqueId(): void;
}
