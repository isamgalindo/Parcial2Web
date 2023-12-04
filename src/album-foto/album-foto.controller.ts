import { Controller, UseInterceptors, Param, Post } from '@nestjs/common';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor';
import { AlbumFotoService } from './album-foto.service';

@Controller('albums')
@UseInterceptors(BusinessErrorsInterceptor)
export class AlbumFotoController {
    constructor(private readonly albumFotoService: AlbumFotoService){}

    @Post(':albumId/fotos/:fotoId')
   async addPhotoToAlbum(@Param('albumId') albumId: string, @Param('fotoId') fotoId: string){
       return await this.albumFotoService.addPhotoToAlbum(albumId, fotoId);
   }

}
