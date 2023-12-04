import { Test, TestingModule } from '@nestjs/testing';
import { AlbumFotoService } from './album-foto.service';
import { AlbumEntity } from '../album/album.entity/album.entity';
import { FotoEntity } from '../foto/foto.entity/foto.entity';
import { faker } from '@faker-js/faker';
import { Repository} from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm'

describe('AlbumFotoService', () => {
  let service: AlbumFotoService;
  let albumRepository: Repository<AlbumEntity>;
  let fotoRepository: Repository<FotoEntity>;
  let album: AlbumEntity;
  let fotosList : FotoEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [AlbumFotoService],
    }).compile();

    service = module.get<AlbumFotoService>(AlbumFotoService);
    albumRepository = module.get<Repository<AlbumEntity>>(getRepositoryToken(AlbumEntity));
    fotoRepository = module.get<Repository<FotoEntity>>(getRepositoryToken(FotoEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    fotoRepository.clear();
    albumRepository.clear();
 
    fotosList = [];
    for(let i = 0; i < 5; i++){
        const foto: FotoEntity = await fotoRepository.save({
          ISO: faker.number.int({ min: 100, max: 6400 }),
          velObturacion: faker.number.int({ min: 2, max: 250 }),
          apertura: faker.number.int({ min: 1, max: 32 }),
          fecha: faker.lorem.sentence(),
        })
        fotosList.push(foto);
    }
 
    album = await albumRepository.save({
      fechaInicio: faker.lorem.sentence(),
      fechaFin: faker.lorem.sentence(),
      titulo: faker.company.name(),
      fotos: fotosList
    })
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addFotoToAlbum should add a foto to an album', async () => {
    const newFoto: FotoEntity = await fotoRepository.save({
      ISO: faker.number.int({ min: 100, max: 6400 }),
      velObturacion: faker.number.int({ min: 2, max: 250 }),
      apertura: faker.number.int({ min: 1, max: 32 }),
      fecha: faker.lorem.sentence(),
    });
 
    const newAlbum: AlbumEntity = await albumRepository.save({
      fechaInicio: faker.lorem.sentence(),
      fechaFin: faker.lorem.sentence(),
      titulo: faker.company.name(),
    })
 
    const result: AlbumEntity = await service.addPhotoToAlbum(newAlbum.id, newFoto.id);
   
    expect(result.fotos.length).toBe(1);
    expect(result.fotos[0]).not.toBeNull();
    expect(result.fotos[0].ISO).not.toBeNull();
    expect(result.fotos[0].ISO).toBe(newFoto.ISO)
    expect(result.fotos[0].velObturacion).toBe(newFoto.velObturacion)
    expect(result.fotos[0].apertura).toBe(newFoto.apertura)
    expect(result.fotos[0].fecha).toBe(newFoto.fecha)
  });


  it('addPhotoToAlbum should thrown exception for an invalid photo', async () => {
    const newAlbum: AlbumEntity = await albumRepository.save({
      fechaInicio: faker.lorem.sentence(),
      fechaFin: faker.lorem.sentence(),
      titulo: faker.company.name(),
    })
  
 
    await expect(() => service.addPhotoToAlbum(newAlbum.id, "0")).rejects.toHaveProperty("message",  "The photo with the given id was not found");
  });

  it('addPhotoToAlbum should throw an exception for an invalid album', async () => {
    const newFoto: FotoEntity = await fotoRepository.save({
      ISO: faker.number.int({ min: 100, max: 6400 }),
      velObturacion: faker.number.int({ min: 2, max: 250 }),
      apertura: faker.number.int({ min: 1, max: 32 }),
      fecha: faker.lorem.sentence(),
    });
 
    await expect(() => service.addPhotoToAlbum("0", newFoto.id)).rejects.toHaveProperty("message", "The album with the given id was not found");
  });
 


});
