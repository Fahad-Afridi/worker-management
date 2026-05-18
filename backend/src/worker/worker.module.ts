import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { WorkerController } from "./worker.controller";
import { WorkerService } from "./worker.service";
import { Worker } from './worker.entity'
import { MailerModule } from "src/mailer/mailer.module";

@Module({
    imports:[
        TypeOrmModule.forFeature([Worker]),
        MailerModule,
    ],
    controllers: [WorkerController],
    providers: [WorkerService],
})
export class WorkerModule{}