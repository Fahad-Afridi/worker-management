import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { WorkerController } from "./worker.controller";
import { WorkerService } from "./worker.service";
import { Worker } from '../auth/worker.entity'

@Module({
    imports:[
        TypeOrmModule.forFeature([Worker]),
    ],
    controllers: [WorkerController],
    providers: [WorkerService],
})
export class WorkerModule{}