import { Module } from '@nestjs/common';
import { AlbumFotoService } from './album-foto.service';
import { AlbumEntity } from '../album/album.entity/album.entity';
import { AlbumService } from '../album/album.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlbumFotoController } from './album-foto.controller';
import { FotoEntity } from 'src/foto/foto.entity/foto.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AlbumEntity, FotoEntity])],
  providers: [AlbumFotoService],
  controllers: [AlbumFotoController]
})
export class AlbumFotoModule {}
