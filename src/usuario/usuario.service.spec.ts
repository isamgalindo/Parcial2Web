import { Test, TestingModule } from '@nestjs/testing';
import { UsuarioService } from './usuario.service';
import { UsuarioEntity } from './usuario.entity/usuario.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { faker } from '@faker-js/faker';
import { RedSocialEntity } from '../red-social/red-social.entity/red-social.entity';

describe('UsuarioService', () => {
  let service: UsuarioService;
  let repository: Repository<UsuarioEntity>;
  let redSocialRepository: Repository<RedSocialEntity>;
  let usuariosList: UsuarioEntity[];
  let redesSocialesList: RedSocialEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [UsuarioService],
    }).compile();

    service = module.get<UsuarioService>(UsuarioService);
    repository = module.get<Repository<UsuarioEntity>>(getRepositoryToken(UsuarioEntity));
    redSocialRepository = module.get<Repository<RedSocialEntity>>(getRepositoryToken(RedSocialEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    usuariosList = [];
    for(let i = 0; i < 5; i++){
        const usuario: UsuarioEntity = await repository.save({
        nombre: faker.company.name(),
        telefono: faker.lorem.sentence()})
        usuariosList.push(usuario);
    }

    redesSocialesList = [];
    for(let i = 0; i < 5; i++){
        const redSocial: RedSocialEntity = await redSocialRepository.save({
        nombre: faker.company.name(),
        slogan: faker.lorem.sentence()
      })
      redesSocialesList.push(redSocial);
    }
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all usuarios', async () => {
    const usuarios: UsuarioEntity[] = await service.findAllUsuario();
    expect(usuarios).not.toBeNull();
    expect(usuarios).toHaveLength(usuariosList.length);
  });


  it('findUsuarioById should return an usuario by id', async () => {
    const storedUsuario: UsuarioEntity = usuariosList[0];
    const usuario: UsuarioEntity = await service.findUsuarioById(storedUsuario.id);
    expect(usuario).not.toBeNull();
    expect(usuario.nombre).toEqual(storedUsuario.nombre)
    expect(usuario.telefono).toEqual(storedUsuario.telefono)
  
  });

  it('create should return a new usuario', async () => {
    const usuario: UsuarioEntity = {
      id: "",
      nombre: faker.lorem.sentence(),
      telefono: faker.number.int({min: 1000000000, max: 9999999999}).toString(),
      fotos: [],
      redSocial: redesSocialesList[0]
    }
 
    const newUser: UsuarioEntity = await service.create(usuario);
    expect(newUser).not.toBeNull();
 
    const storedUser: UsuarioEntity = await repository.findOne({where: {id: newUser.id}})
    expect(storedUser).not.toBeNull();
    expect(storedUser.nombre).toEqual(newUser.nombre)
    expect(storedUser.telefono).toEqual(newUser.telefono)
  });


});
