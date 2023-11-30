import { Module } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { TypeOrmModule} from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([UsuarioModule])],
  providers: [UsuarioService]
})
export class UsuarioModule {

}
