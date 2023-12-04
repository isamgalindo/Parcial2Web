import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AlbumEntity } from './album.entity/album.entity';
import { Repository} from 'typeorm';
import { BusinessLogicException, BusinessError } from '../shared/errors/business-errors';

@Injectable()
export class AlbumService {

    constructor(
        @InjectRepository(AlbumEntity)
        private readonly albumRepository: Repository<AlbumEntity>
    ){}

    async create(album: AlbumEntity): Promise<AlbumEntity> {
        return await this.albumRepository.save(album);
    }

    async findAlbumById(id: string): Promise<AlbumEntity> {
        const album: AlbumEntity = await this.albumRepository.findOne({where: {id}, relations: ["fotos"] } );
        if (!album)
          throw new BusinessLogicException("The album with the given id was not found", BusinessError.NOT_FOUND);
   
        return album;
    }

    async deleteAlbumById(id: string) {
        const album: AlbumEntity = await this.albumRepository.findOne({where:{id}, relations: ['fotos']});
        if (!album)
          throw new BusinessLogicException("The album with the given id was not found", BusinessError.NOT_FOUND);

        if (album.fotos && album.fotos.length > 0)
          throw new BusinessLogicException("Cannot delete album with photos", BusinessError.PRECONDITION_FAILED);
     
        await this.albumRepository.remove(album);
    }

}
