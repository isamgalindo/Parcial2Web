import { Injectable } from '@nestjs/common';
import { DEFAULT_FACTORY_CLASS_METHOD_KEY } from '@nestjs/common/module-utils/constants';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository} from 'typeorm';
import { FotoEntity } from './foto.entity/foto.entity';
import { BusinessLogicException, BusinessError } from '../shared/errors/business-errors';

@Injectable()
export class FotoService {

    constructor(
        @InjectRepository(FotoEntity)
        private readonly fotoRepository: Repository<FotoEntity>
    ){}

    async createFoto(foto: FotoEntity): Promise<FotoEntity> {
        if (foto.ISO < 100) {
            throw new BusinessLogicException("The ISO is below 100", BusinessError.PRECONDITION_FAILED);
        }
        return await this.fotoRepository.save(foto);
    }

    async findFotoById(id: string): Promise<FotoEntity> {
        const foto: FotoEntity = await this.fotoRepository.findOne({where: {id}, relations: ["usuario", "album"] } );
        if (!foto)
          throw new BusinessLogicException("The foto with the given id was not found", BusinessError.NOT_FOUND);
   
        return foto;
    }

    async findAllFotos(): Promise<FotoEntity[]> {
        return await this.fotoRepository.find({ relations: ["usuario", "album"] });
    }

    async deleteFoto(id: string) {
        const foto: FotoEntity = await this.fotoRepository.findOne({where:{id}});
        if (!foto)
          throw new BusinessLogicException("The foto with the given id was not found", BusinessError.NOT_FOUND);
     
        await this.fotoRepository.remove(foto);
    }
 
}
