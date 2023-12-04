import { Test, TestingModule } from '@nestjs/testing';
import { RedSocialService } from './red-social.service';
import { faker } from '@faker-js/faker';
import { RedSocialEntity } from './red-social.entity/red-social.entity';
import { Repository} from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('RedSocialService', () => {
  let service: RedSocialService;
  let repository: Repository<RedSocialEntity>;
  let redesSocialesList: RedSocialEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [RedSocialService],
    }).compile();

    service = module.get<RedSocialService>(RedSocialService);
    repository = module.get<Repository<RedSocialEntity>>(getRepositoryToken(RedSocialEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    redesSocialesList = [];
    for(let i = 0; i < 5; i++){
        const redSocial: RedSocialEntity = await repository.save({
        nombre: faker.company.name(),
        slogan: faker.lorem.sentence()})
        redesSocialesList.push(redSocial);
    }
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  function generateSlogan() {
    let slogan = faker.lorem.sentence();
    while (slogan.length < 20) {
        slogan += ' ' + faker.lorem.word();
    }
    return slogan;
}


  it('create should return a new redSocial', async () => {
    const redSocial: RedSocialEntity = {
      id: "",
      nombre: faker.company.name(),
      slogan: generateSlogan(),
      usuarios: []
    }
 
    const newRedSocial: RedSocialEntity = await service.create(redSocial);
    expect(newRedSocial).not.toBeNull();
 
    const storedRedSocial: RedSocialEntity = await repository.findOne({where: {id: newRedSocial.id}})
    expect(storedRedSocial).not.toBeNull();
    expect(storedRedSocial.nombre).toEqual(newRedSocial.nombre)
    expect(storedRedSocial.slogan).toEqual(newRedSocial.slogan)

    expect(storedRedSocial.slogan.length).toBeGreaterThanOrEqual(20);
  });


  it('create should throw an exception if slogan is less than 20 characters', async () => {
    const redSocial: RedSocialEntity = {
      id: "",
      nombre: faker.company.name(),
      slogan: 'hola',
      usuarios: []
    }

    await expect(() => service.create(redSocial)).rejects.toHaveProperty("message", "Slogan must be at least 20 characters long");
});

});
