"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const task_entity_1 = require("./task.entity");
let TaskService = class TaskService {
    taskRepository;
    constructor(taskRepository) {
        this.taskRepository = taskRepository;
    }
    async create(dto) {
        const task = this.taskRepository.create(dto);
        await this.taskRepository.save(task);
        return task;
    }
    async findOne(id) {
        const task = await this.taskRepository.findOne({
            where: { id },
            relations: ['worker'],
        });
        if (!task) {
            throw new common_1.NotFoundException(`Task with id ${id} not found`);
        }
        return task;
    }
    async findByWorker(workerId) {
        const tasks = await this.taskRepository.find({
            where: { workerId },
            relations: ['worker'],
        });
        if (!tasks.length) {
            throw new common_1.NotFoundException(`No tasks found for worker with id ${workerId}`);
        }
        return tasks;
    }
    async update(id, dto) {
        const task = await this.findOne(id);
        Object.assign(task, dto);
        await this.taskRepository.save(task);
        return task;
    }
    async remove(id) {
        const task = await this.findOne(id);
        await this.taskRepository.remove(task);
        return { message: `Task ${task.title} deleted successfully` };
    }
};
exports.TaskService = TaskService;
exports.TaskService = TaskService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(task_entity_1.Task)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], TaskService);
//# sourceMappingURL=task.service.js.map