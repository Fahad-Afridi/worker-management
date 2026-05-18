import { Controller,Get, Post, Patch, Delete, Body, Param, ParseIntPipe } from "@nestjs/common";
import { TaskService } from "./task.service";
import { CreateTaskDto } from "./dto/create-task.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";
import { Roles } from "src/auth/decorator/roles.decorator";
import { Role } from "src/worker/worker.entity";

@Controller('task')
export class TaskController{
    constructor(private taskService : TaskService){}

    @Roles(Role.ADMIN)
    @Post()
    create (@Body() dto: CreateTaskDto){
        return this.taskService.create(dto);
    }

    @Get(':id')
    findOne(@Param('id',ParseIntPipe)id: number){
        return this.taskService.findOne(id);
    }

    @Get('worker/:workerId')
    findByWorker(@Param('workerId',ParseIntPipe)workerId:number){
        return this.taskService.findByWorker(workerId);
    }

    @Patch(':id')
    update(@Param('id',ParseIntPipe)id:number,@Body() dto:UpdateTaskDto,){
        return this.taskService.update(id,dto);
    }

    @Roles(Role.ADMIN)
    @Delete(':id')
    remove(@Param('id',ParseIntPipe)id:number){
        return this.taskService.remove(id);
    }
}