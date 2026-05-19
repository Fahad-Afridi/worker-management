"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkerService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const typeorm_2 = require("@nestjs/typeorm");
const worker_entity_1 = require("./worker.entity");
const bcrypt = __importStar(require("bcryptjs"));
const mailer_service_1 = require("../mailer/mailer.service");
let WorkerService = class WorkerService {
    workerRepository;
    emailService;
    constructor(workerRepository, emailService) {
        this.workerRepository = workerRepository;
        this.emailService = emailService;
    }
    async findAll() {
        return this.workerRepository.find();
    }
    async findOne(id) {
        const worker = await this.workerRepository.findOne({
            where: { id },
        });
        if (!worker) {
            throw new common_1.NotFoundException(`Worker with is ${id} not found `);
        }
        return worker;
    }
    async create(dto) {
        const existing = await this.workerRepository.findOne({
            where: { email: dto.email },
        });
        if (existing) {
            throw new common_1.ConflictException('Email already exist');
        }
        const hashedPassword = await bcrypt.hash(dto.password, 12);
        const worker = this.workerRepository.create({
            ...dto,
            password: hashedPassword,
        });
        await this.workerRepository.save(worker);
        await this.emailService.sendwelcomeEmail(worker.name, worker.email);
        const { password, ...result } = worker;
        return result;
    }
    async update(id, dto) {
        const worker = await this.findOne(id);
        if (dto.password) {
            dto.password = await bcrypt.hash(dto.password, 12);
        }
        Object.assign(worker, dto);
        await this.workerRepository.save(worker);
        const { password, ...result } = worker;
        return result;
    }
    async updateCountry(id, country) {
        const worker = await this.findOne(id);
        worker.country = country;
        await this.workerRepository.save(worker);
        return worker;
    }
    async remove(id) {
        const worker = await this.findOne(id);
        await this.workerRepository.remove(worker);
        return { message: `Worker ${worker.name} deleted successfully` };
    }
};
exports.WorkerService = WorkerService;
exports.WorkerService = WorkerService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(worker_entity_1.Worker)),
    __metadata("design:paramtypes", [typeorm_1.Repository,
        mailer_service_1.EmailService])
], WorkerService);
//# sourceMappingURL=worker.service.js.map