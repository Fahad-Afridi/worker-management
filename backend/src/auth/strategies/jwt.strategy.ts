import { Injectable,UnauthorizedException } from "@nestjs/common";
import{ PassportStrategy } from '@nestjs/passport';
import { ExtractJwt,Strategy } from "passport-jwt";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Worker } from '../../worker/worker.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt'){
    constructor(
        configService : ConfigService,
        @InjectRepository(Worker)
        private workerRepository: Repository<Worker>,
    ){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('JWT_SECRET')??'fallback_secret',
        });
    }
    async validate(payload: any){
        const worker = await this.workerRepository.findOne({
            where: {id: payload.sub},
        });
        if(!worker){
            throw new UnauthorizedException('Worker no longer exists');
        }
        return{
            id: worker.id,
            email: worker.email,
        };
    }
}
