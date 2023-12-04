import { Test, TestingModule } from '@nestjs/testing';
import { FotoService } from './foto.service';
import { FotoEntity } from './foto.entity/foto.entity';
import { faker } from '@faker-js/faker';
import { Repository} from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm'
import { UsuarioEntity } from '../usuario/usuario.entity/usuario.entity';
import { AlbumEntity } from '../album/album.entity/album.entity';

describe('FotoService', () => {
  let service: FotoService;
  let repository: Repository<FotoEntity>;
  let usuarioRepository: Repository<UsuarioEntity>;
  let albumRepository: Repository<AlbumEntity>;
  let fotosList: FotoEntity[];
  let usuariosList: UsuarioEntity[];
  let albumsList: AlbumEntity[];
  

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [FotoService],
    }).compile();

    service = module.get<FotoService>(FotoService);
    repository = module.get<Repository<FotoEntity>>(getRepositoryToken(FotoEntity));
    usuarioRepository = module.get<Repository<UsuarioEntity>>(getRepositoryToken(UsuarioEntity));
    albumRepository = module.get<Repository<AlbumEntity>>(getRepositoryToken(AlbumEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    fotosList = [];
    for(let i = 0; i < 5; i++){
        const foto: FotoEntity = await repository.save({
        ISO: faker.number.int({ min: 100, max: 6400 }),
        velObturacion: faker.number.int({ min: 2, max: 250 }),
        apertura: faker.number.int({ min: 1, max: 32 }),
        fecha: faker.lorem.sentence(),
        image: faker.lorem.sentence(),
      })
        fotosList.push(foto);
    }
    usuariosList = [];
    for(let i = 0; i < 5; i++){
        const usuario: UsuarioEntity = await usuarioRepository.save({
        nombre: faker.company.name(),
        telefono: faker.lorem.sentence()
      })
      usuariosList.push(usuario);
    }

    albumsList = [];
    for(let i = 0; i < 5; i++){
        const album: AlbumEntity = await albumRepository.save({
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

  it('findAll should return all fotos', async () => {
    const fotos: FotoEntity[] = await service.findAllFotos();
    expect(fotos).not.toBeNull();
    expect(fotos).toHaveLength(fotosList.length);
  });

  function generateFotoValues() {
    let iso = faker.number.int({ min: 100, max: 6400 });
    let velObturacion = faker.number.int({ min: 2, max: 250 });
    let apertura = faker.number.int({ min: 1, max: 32 });

    let valuesAboveMiddle = [
        iso > 3350, 
        velObturacion > 126,
        apertura > 16.5
    ].filter(v => v).length;

    while (valuesAboveMiddle > 2) {
      if (iso > 3350) {
          iso = faker.number.int({ min: 100, max: 3350 });
      } else if (velObturacion > 126) {
          velObturacion = faker.number.int({ min: 2, max: 126 });
      } else if (apertura > 16.5) {
          apertura = faker.number.int({ min: 1, max: 16 });
      }
      valuesAboveMiddle = [iso > 3350, velObturacion > 126, apertura > 16.5].filter(v => v).length;
  }



    return { iso, velObturacion, apertura };
}
  it('findFotoById should return a foto by id', async () => {
    const storedFoto: FotoEntity = fotosList[0];
    const foto: FotoEntity = await service.findFotoById(storedFoto.id);
    expect(foto).not.toBeNull();
    expect(foto.ISO).toEqual(storedFoto.ISO)
    expect(foto.velObturacion).toEqual(storedFoto.velObturacion)
    expect(foto.apertura).toEqual(storedFoto.apertura)
    expect(foto.fecha).toEqual(storedFoto.fecha)
  });

  it('findFotoById should throw an exception for an invalid foto', async () => {
    await expect(() => service.findFotoById("0")).rejects.toHaveProperty("message", "The foto with the given id was not found")
  });
 


  it('create should return a new foto', async () => {
    const { iso, velObturacion, apertura } = generateFotoValues();
    const foto: FotoEntity = {
      id: "",
      ISO: iso,
      velObturacion: velObturacion,
      apertura: apertura,
      fecha: faker.lorem.sentence(),
      usuario: usuariosList[0],
      album: albumsList[0]
    }
 
    const newFoto: FotoEntity = await service.createFoto(foto);
    expect(newFoto).not.toBeNull();
 
    const storedFoto: FotoEntity = await repository.findOne({where: {id: newFoto.id}})
    expect(storedFoto).not.toBeNull();
    expect(storedFoto.ISO).toEqual(newFoto.ISO)
    expect(storedFoto.velObturacion).toEqual(newFoto.velObturacion)
    expect(storedFoto.apertura).toEqual(newFoto.apertura)
    expect(storedFoto.fecha).toEqual(newFoto.fecha)
  });

  it('create should throw an exception if ISO is below 100', async () => {
    const foto: FotoEntity = {
        id: "",
        ISO: 99,
        velObturacion: faker.number.int({ min: 2, max: 250 }),
        apertura: faker.number.int({ min: 1, max: 32 }),
        fecha: faker.lorem.sentence(),
        usuario: usuariosList[0],
        album: albumsList[0]
    };

    await expect(() => service.createFoto(foto)).rejects.toHaveProperty("message", "The ISO is below 100");
});

  it('delete should remove a foto', async () => {
    const foto: FotoEntity = fotosList[0];
    await service.deleteFoto(foto.id);
     const deletedFoto: FotoEntity = await repository.findOne({ where: { id: foto.id } })
    expect(deletedFoto).toBeNull();
  });

  it('delete should throw an exception for an invalid foto', async () => {
    const foto: FotoEntity = fotosList[0];
    await expect(() => service.deleteFoto("0")).rejects.toHaveProperty("message", "The foto with the given id was not found")
  });

});
