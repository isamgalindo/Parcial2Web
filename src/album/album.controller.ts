import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors} from '@nestjs/common';
import { AlbumService } from './album.service';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor';
import { AlbumDto } from './album.dto/album.dto';
import { AlbumEntity } from './album.entity/album.entity';
import { plainToInstance } from 'class-transformer';

@Controller('albums')
@UseInterceptors(BusinessErrorsInterceptor)
export class AlbumController {
    constructor(private readonly albumService: AlbumService) {}
    
    @Get(':albumId')
    async findAlbumById(@Param('albumId') albumId: string) {
        return await this.albumService.findAlbumById(albumId);
    }
    
    @Post()
    async createAlbum(@Body() albumDto: AlbumDto) {
        const album: AlbumEntity = plainToInstance(AlbumEntity, albumDto);
        return await this.albumService.create(album);
    }
    
    @Delete(':albumId')
    @HttpCode(204)
    async delete(@Param('albumId') albumId: string) {
        return await this.albumService.deleteAlbumById(albumId);
    }
}
