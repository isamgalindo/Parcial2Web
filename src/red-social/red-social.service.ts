import { Injectable } from '@nestjs/common';
import { RedSocialEntity } from './red-social.entity/red-social.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository} from 'typeorm';
import { BusinessLogicException, BusinessError } from '../shared/errors/business-errors';
@Injectable()
export class RedSocialService {
    constructor(
        @InjectRepository(RedSocialEntity)
        private readonly redSocialRepository: Repository<RedSocialEntity>
    ){}

    async create(redSocial: RedSocialEntity): Promise<RedSocialEntity> {
        if (redSocial.slogan.length < 20) {
            throw new BusinessLogicException("Slogan must be at least 20 characters long", BusinessError.PRECONDITION_FAILED);
        }
        return await this.redSocialRepository.save(redSocial);
    }
}
