import { Controller,Get, Post, Patch, Delete, Body, Param, ParseIntPipe } from "@nestjs/common";
import { TaskService } from "./task.service";
import { CreateTaskDto } from "./dto/create-task.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";

@Controller('task')
export class TaskController{
    constructor(private taskService : TaskService){}

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

    @Delete(':id')
    remove(@Param('id',ParseIntPipe)id:number){
        return this.taskService.remove(id);
    }
}