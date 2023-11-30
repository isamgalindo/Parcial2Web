/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { AlbumService } from './album.service';
import { AlbumEntity } from './album.entity/album.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { faker } from '@faker-js/faker';

describe('AlbumService', () => {
  let service: AlbumService;
  let repository: Repository<AlbumEntity>;
  let albumsList: AlbumEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [AlbumService],
    }).compile();

    service = module.get<AlbumService>(AlbumService);
    repository = module.get<Repository<AlbumEntity>>(getRepositoryToken(AlbumEntity));
    await seedDatabase();
  });
  const seedDatabase = async () => {
    repository.clear();
    albumsList = [];
    for(let i = 0; i < 5; i++){
        const album: AlbumEntity = await repository.save({
          fechaInicio: faker.lorem.sentence(),
          fechaFin: faker.lorem.sentence(),
          titulo: faker.company.name()
        })
        albumsList.push(album);
    }
  }
 

  it('should be defined', () => {
    expect(service).toBeDefined();
  });


  it('create should return a new album', async () => {
    const album: AlbumEntity = {
      id: "",
      fechaInicio: faker.lorem.sentence(),
      fechaFin: faker.lorem.sentence(),
      titulo: faker.company.name(),
      fotos: [],
    }
 
    const newAlbum: AlbumEntity = await service.create(album);
    expect(newAlbum).not.toBeNull();
 
    const storedAlbum: AlbumEntity = await repository.findOne({where: {id: newAlbum.id}})
    expect(storedAlbum).not.toBeNull();
    expect(storedAlbum.fechaInicio).toEqual(newAlbum.fechaInicio)
    expect(storedAlbum.fechaFin).toEqual(newAlbum.fechaFin)
    expect(storedAlbum.titulo).not.toBeNull()
    expect(storedAlbum.titulo).toEqual(newAlbum.titulo)
  });

  it('findAlbumById should return an album by id', async () => {
    const storedAlbum: AlbumEntity = albumsList[0];
    const album: AlbumEntity = await service.findAlbumById(storedAlbum.id);
    expect(album).not.toBeNull();
    expect(album.fechaInicio).toEqual(storedAlbum.fechaInicio)
    expect(album.fechaFin).toEqual(storedAlbum.fechaFin)
    expect(album.titulo).toEqual(storedAlbum.titulo)
  });

  it('findAlbumById should throw an exception for an invalid album', async () => {
    await expect(() => service.findAlbumById("0")).rejects.toHaveProperty("message", "The album with the given id was not found")
  });

  it('delete should remove an album', async () => {
    const album: AlbumEntity = albumsList[0];
    await service.deleteAlbumById(album.id);
     const deletedAlbum: AlbumEntity = await repository.findOne({ where: { id: album.id } })
    expect(deletedAlbum).toBeNull();
  });

  it('delete should throw an exception for an invalid album', async () => {
    const album: AlbumEntity = albumsList[0];
    await expect(() => service.deleteAlbumById("0")).rejects.toHaveProperty("message", "The album with the given id was not found")
  });
});
