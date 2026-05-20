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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = __importStar(require("bcryptjs"));
const crypto = __importStar(require("crypto"));
const worker_entity_1 = require("../worker/worker.entity");
const mailer_service_1 = require("../mailer/mailer.service");
const config_1 = require("@nestjs/config");
let AuthService = class AuthService {
    workerRepository;
    jwtService;
    emailService;
    configService;
    constructor(workerRepository, jwtService, emailService, configService) {
        this.workerRepository = workerRepository;
        this.jwtService = jwtService;
        this.emailService = emailService;
        this.configService = configService;
    }
    async register(dto) {
        const existing = await this.workerRepository.findOne({
            where: { email: dto.email },
        });
        if (existing) {
            throw new common_1.ConflictException('Email already registered');
        }
        const hashedPassword = await bcrypt.hash(dto.password, 12);
        const worker = this.workerRepository.create({
            name: dto.name,
            email: dto.email,
            password: hashedPassword,
            country: dto.country,
        });
        await this.workerRepository.save(worker);
        return {
            message: 'Registration successful',
            worker: {
                id: worker.id,
                uniqueId: worker.uniqueId,
                name: worker.name,
                email: worker.email,
                country: worker.country,
            },
        };
    }
    async login(dto) {
        const worker = await this.workerRepository
            .createQueryBuilder('worker')
            .where('worker.email = :email', { email: dto.email })
            .addSelect('worker.password')
            .getOne();
        if (!worker) {
            throw new common_1.UnauthorizedException('Invalid Credentials');
        }
        const passwordMatch = await bcrypt.compare(dto.password, worker.password);
        if (!passwordMatch) {
            throw new common_1.UnauthorizedException('Invalid Credentials');
        }
        const payload = {
            sub: worker.id,
            email: worker.email,
            role: worker.role,
        };
        const access_token = this.jwtService.sign(payload);
        const refresh_token = this.jwtService.sign(payload, {
            secret: this.configService.get('JWT_REFRESH_SECRET'),
            expiresIn: '7d',
        });
        return {
            access_token,
            refresh_token,
            worker: {
                id: worker.id,
                uniqueId: worker.uniqueId,
                name: worker.name,
                email: worker.email,
                country: worker.country,
                role: worker.role,
            },
        };
    }
    async forgetPassword(dto) {
        const worker = await this.workerRepository.findOne({
            where: { email: dto.email },
        });
        if (!worker) {
            return {
                message: 'If this eamil exists you will receive a reset link',
            };
        }
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpiry = new Date(Date.now() + 15 * 60 * 1000);
        worker.resetToken = resetToken;
        worker.resetTokenExpiry = resetTokenExpiry;
        await this.workerRepository.save(worker);
        await this.emailService.sendPasswordResetEmail(worker.name, worker.email, resetToken);
        return {
            message: 'If this eamil exists you will recive a reset link',
        };
    }
    async resetPassword(dto) {
        const worker = await this.workerRepository
            .createQueryBuilder('worker')
            .where('worker.resetToken = :token', { token: dto.token })
            .addSelect('worker.resetToken')
            .getOne();
        if (!worker) {
            throw new common_1.BadRequestException('Invalid reset token');
        }
        const now = new Date();
        if (!worker.resetTokenExpiry || worker.resetTokenExpiry < now) {
            worker.resetToken = null;
            worker.resetTokenExpiry = null;
            await this.workerRepository.save(worker);
            throw new common_1.BadRequestException('Reset token has expired');
        }
        const hashedPassword = await bcrypt.hash(dto.newPassword, 12);
        worker.password = hashedPassword;
        worker.resetToken = null;
        worker.resetTokenExpiry = null;
        await this.workerRepository.save(worker);
        return {
            message: 'Password reset successful. You can now login.',
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(worker_entity_1.Worker)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        jwt_1.JwtService,
        mailer_service_1.EmailService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map