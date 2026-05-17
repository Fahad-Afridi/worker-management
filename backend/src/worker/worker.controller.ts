import { Controller, Get, Post, Put, Patch, Delete, Body, Param, ParseIntPipe } from "@nestjs/common";
import { WorkerService } from "./worker.service";
import { CreateworkerDto } from "./dto/create-worker.dto";
import { UpdateWorkerDto } from "./dto/update-worker.dto";

@ Controller('worker')
export class WorkerController {
    constructor (private workerservice : WorkerService){}

    @Get()
    findAll(){
        return this.workerservice.findAll();
    }
    @Get(':id')
    findOne(@Param('id', ParseIntPipe)id:number){
        return this.workerservice.findOne(id);
    }

    @Post()
    create(@Body() dto:CreateworkerDto){
        return this.workerservice.create(dto);
    }

    @Put(':id')
    update(@Param('id',ParseIntPipe)id:number,@Body() dto:UpdateWorkerDto){
        return this.workerservice.update(id, dto);
    }
    @Patch(':id/country')
    updateCountry(
        @Param('id',ParseIntPipe) id: number,
        @Body('country') country: string, 
    ){
        return this.workerservice.updateCountry(id, country);
    }

    @Delete(':id')
    remove(@Param('id',ParseIntPipe)id:number){
        return this.workerservice.remove(id);
    }
}