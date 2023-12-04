import { Controller, UseInterceptors, Get, Post, Param, Body} from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor';
import { UsuarioDto } from './usuario.dto/usuario.dto';
import { UsuarioEntity } from './usuario.entity/usuario.entity';
import { plainToInstance } from 'class-transformer';

@Controller('usuarios')
@UseInterceptors(BusinessErrorsInterceptor)
export class UsuarioController {
    constructor(private readonly usuarioService: UsuarioService) {}

    @Get()
    async findAll() {
        return await this.usuarioService.findAllUsuario();
    }
    
    @Get(':usuarioId')
    async findUsuarioById(@Param('usuarioId') usuarioId: string) {
        return await this.usuarioService.findUsuarioById(usuarioId);
    }

  @Post()
  async createUsuario(@Body() usuarioDto: UsuarioDto) {
    const usuario: UsuarioEntity = plainToInstance(UsuarioEntity, usuarioDto);
    return await this.usuarioService.create(usuario);
  }

}
