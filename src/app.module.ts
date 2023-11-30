import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FotoModule } from './foto/foto.module';
import { UsuarioModule } from './usuario/usuario.module';
import { RedSocialModule } from './red-social/red-social.module';
import { AlbumModule } from './album/album.module';

@Module({
  imports: [FotoModule, UsuarioModule, RedSocialModule, AlbumModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
