import { Injectable,NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, UpdateOneModel } from "typeorm";
import { Task } from "./task.entity";
import { CreateTaskDto } from "./dto/create-task.dto";
import { UpdateTaskDto} from "./dto/update-task.dto";
import { uptime } from "process";

@Injectable()
export class TaskService{
    constructor(
        @InjectRepository(Task)
        private taskRepository: Repository<Task>,
    ){}

    async create (dto:CreateTaskDto){
        const task = this.taskRepository.create(dto);
        await this.taskRepository.save(task);
        return task;
    }

    async findOne(id: number): Promise<Task> {
        const task = await this.taskRepository.findOne({
          where: { id },
          relations: ['worker'],
        });
      
        if (!task) {
          throw new NotFoundException(`Task with id ${id} not found`);
        }
      
        return task;
      }

      async findByWorker(workerId: number): Promise<Task[]> {
        const tasks = await this.taskRepository.find({
          where: { workerId },
          relations: ['worker'],
        });
      
        if (!tasks.length) {
          throw new NotFoundException(
            `No tasks found for worker with id ${workerId}`,
          );
        }
      
        return tasks;
      }

    async update (id:number, dto:UpdateTaskDto){
        const task = await this.findOne(id);
        Object.assign(task, dto);
        await this.taskRepository.save(task);
        return task;
    }

    async remove(id: number) {
        const task = await this.findOne(id);
        await this.taskRepository.remove(task);
        return { message: `Task ${task.title} deleted successfully` };
      }
}