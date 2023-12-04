import { Injectable } from '@nestjs/common';
import { AlbumEntity } from '../album/album.entity/album.entity';
import { FotoEntity } from '../foto/foto.entity/foto.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class AlbumFotoService {
    constructor(
        @InjectRepository(AlbumEntity)
        private readonly albumRepository: Repository<AlbumEntity>,
    
        @InjectRepository(FotoEntity)
        private readonly fotoRepository: Repository<FotoEntity>
    ) {}

    async addPhotoToAlbum(albumId: string, fotoId: string): Promise<AlbumEntity> {
        const foto: FotoEntity = await this.fotoRepository.findOne({where: {id: fotoId}});
        if (!foto)
          throw new BusinessLogicException("The photo with the given id was not found", BusinessError.NOT_FOUND);
      
        const album: AlbumEntity = await this.albumRepository.findOne({where: {id: albumId}, relations: ["fotos"]})
        if (!album)
          throw new BusinessLogicException("The album with the given id was not found", BusinessError.NOT_FOUND);
    
          album.fotos = [...album.fotos, foto];
          return await this.albumRepository.save(album);
      }

    async deleteFotoOfAlbum(albumId: string, fotoId: string){
        const foto: FotoEntity = await this.fotoRepository.findOne({where: {id: fotoId}});
        if (!foto)
          throw new BusinessLogicException("The foto with the given id was not found", BusinessError.NOT_FOUND)
    
        const album: AlbumEntity = await this.albumRepository.findOne({where: {id: albumId}, relations: ["fotos"]});
        if (!album)
          throw new BusinessLogicException("The album with the given id was not found", BusinessError.NOT_FOUND)
    
        const albumFoto: FotoEntity = album.fotos.find(e => e.id === foto.id);
    
        if (!albumFoto)
            throw new BusinessLogicException("The foto with the given id is not associated to the album", BusinessError.PRECONDITION_FAILED)
 
        album.fotos = album.fotos.filter(e => e.id !== fotoId);
        if (album.fotos.length === 0) {
            await this.albumRepository.remove(album);
        } else {
            await this.albumRepository.save(album);
        }
    
        await this.fotoRepository.remove(foto);
    }  
}
