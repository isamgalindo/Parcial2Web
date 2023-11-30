import { Injectable } from '@nestjs/common';
import { UsuarioEntity } from './usuario.entity/usuario.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository} from 'typeorm';
import { BusinessLogicException, BusinessError } from '../shared/errors/business-errors';

@Injectable()
export class UsuarioService {

    constructor(
        @InjectRepository(UsuarioEntity)
        private readonly usuarioRepository: Repository<UsuarioEntity>
    ){}
    
    async findAllUsuario(): Promise<UsuarioEntity[]> {
        return await this.usuarioRepository.find({ relations: ["fotos", "redSocial"] });
    }

    async findUsuarioById(id: string): Promise<UsuarioEntity> {
        const usuario: UsuarioEntity = await this.usuarioRepository.findOne({where: {id}, relations: ["fotos", "redSocial"] } );
        if (!usuario)
          throw new BusinessLogicException("The usario with the given id was not found", BusinessError.NOT_FOUND);
   
        return usuario;
    }

    async create(usuario: UsuarioEntity): Promise<UsuarioEntity> {
        return await this.usuarioRepository.save(usuario);
    }


}
