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
exports.WorkerController = void 0;
const common_1 = require("@nestjs/common");
const worker_service_1 = require("./worker.service");
const create_worker_dto_1 = require("./dto/create-worker.dto");
const update_worker_dto_1 = require("./dto/update-worker.dto");
const roles_decorator_1 = require("../auth/decorator/roles.decorator");
const worker_entity_1 = require("./worker.entity");
let WorkerController = class WorkerController {
    workerservice;
    constructor(workerservice) {
        this.workerservice = workerservice;
    }
    findAll() {
        return this.workerservice.findAll();
    }
    findOne(id) {
        return this.workerservice.findOne(id);
    }
    create(dto) {
        return this.workerservice.create(dto);
    }
    update(id, dto) {
        return this.workerservice.update(id, dto);
    }
    updateCountry(id, country) {
        return this.workerservice.updateCountry(id, country);
    }
    remove(id) {
        return this.workerservice.remove(id);
    }
};
exports.WorkerController = WorkerController;
__decorate([
    (0, roles_decorator_1.Roles)(worker_entity_1.Role.ADMIN),
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], WorkerController.prototype, "findAll", null);
__decorate([
    (0, roles_decorator_1.Roles)(worker_entity_1.Role.ADMIN),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], WorkerController.prototype, "findOne", null);
__decorate([
    (0, roles_decorator_1.Roles)(worker_entity_1.Role.ADMIN),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_worker_dto_1.CreateworkerDto]),
    __metadata("design:returntype", void 0)
], WorkerController.prototype, "create", null);
__decorate([
    (0, roles_decorator_1.Roles)(worker_entity_1.Role.ADMIN),
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_worker_dto_1.UpdateWorkerDto]),
    __metadata("design:returntype", void 0)
], WorkerController.prototype, "update", null);
__decorate([
    (0, roles_decorator_1.Roles)(worker_entity_1.Role.ADMIN),
    (0, common_1.Patch)(':id/country'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)('country')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", void 0)
], WorkerController.prototype, "updateCountry", null);
__decorate([
    (0, roles_decorator_1.Roles)(worker_entity_1.Role.ADMIN),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], WorkerController.prototype, "remove", null);
exports.WorkerController = WorkerController = __decorate([
    (0, common_1.Controller)('worker'),
    __metadata("design:paramtypes", [worker_service_1.WorkerService])
], WorkerController);
//# sourceMappingURL=worker.controller.js.map