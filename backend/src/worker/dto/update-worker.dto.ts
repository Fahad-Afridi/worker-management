import { PartialType } from "@nestjs/mapped-types";
import { CreateworkerDto } from "./create-worker.dto";

export class UpdateWorkerDto extends PartialType(CreateworkerDto){}