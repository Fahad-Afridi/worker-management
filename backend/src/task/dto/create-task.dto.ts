import { IsString, IsNumber,IsOptional,IsEnum } from "class-validator";
import { TaskStatus } from "../task.entity";

export class CreateTaskDto{
    @IsString()
    title: string;

    @IsString()
    description: string;

    @IsOptional()
    @IsEnum(TaskStatus)
    status?:TaskStatus;

    @IsNumber()
    workerId:number;
}