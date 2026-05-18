import { Controller, Get, Post, Put, Patch, Delete, Body, Param, ParseIntPipe } from "@nestjs/common";
import { WorkerService } from "./worker.service";
import { CreateworkerDto } from "./dto/create-worker.dto";
import { UpdateWorkerDto } from "./dto/update-worker.dto";
import { Roles } from "src/auth/decorator/roles.decorator";
import { Role } from "./worker.entity";

@ Controller('worker')
export class WorkerController {
    constructor (private workerservice : WorkerService){}
    
    @Roles(Role.ADMIN)
    @Get()
    findAll(){
        return this.workerservice.findAll();
    }

    @Roles(Role.ADMIN)
    @Get(':id')
    findOne(@Param('id', ParseIntPipe)id:number){
        return this.workerservice.findOne(id);
    }

    @Roles(Role.ADMIN)
    @Post()
    create(@Body() dto:CreateworkerDto){
        return this.workerservice.create(dto);
    }

    @Roles(Role.ADMIN)
    @Put(':id')
    update(@Param('id',ParseIntPipe)id:number,@Body() dto:UpdateWorkerDto){
        return this.workerservice.update(id, dto);
    }

    @Roles(Role.ADMIN)
    @Patch(':id/country')
    updateCountry(
        @Param('id',ParseIntPipe) id: number,
        @Body('country') country: string, 
    ){
        return this.workerservice.updateCountry(id, country);
    }

    @Roles(Role.ADMIN)
    @Delete(':id')
    remove(@Param('id',ParseIntPipe)id:number){
        return this.workerservice.remove(id);
    }
}