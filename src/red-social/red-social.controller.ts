import { Controller, Body, Post, UseInterceptors} from '@nestjs/common';
import { RedSocialService } from './red-social.service';
import { RedSocialDto } from './red-social.dto/red-social.dto';
import { RedSocialEntity } from './red-social.entity/red-social.entity';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor';

@Controller('red-socials')
@UseInterceptors(BusinessErrorsInterceptor)
export class RedSocialController {
    constructor(private readonly redSocialService: RedSocialService) {}

    @Post()
    async createRedSocial(@Body() redSocialDto: RedSocialDto) {
        const redSocial: RedSocialEntity = plainToInstance(RedSocialEntity, redSocialDto);
        return await this.redSocialService.create(redSocial);
    }
}
