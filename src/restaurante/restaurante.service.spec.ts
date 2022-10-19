import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { RestauranteEntity } from './restaurante.entity';
import { RestauranteService } from './restaurante.service';
import { faker } from '@faker-js/faker';
import { CiudadEntity } from '../ciudad/ciudad.entity';
import { CulturaGastronomicaEntity } from '../culturagastronomica/culturagastronomica.entity';

describe('RestauranteService', () => {
  let service: RestauranteService;
  let restauranteRepository: Repository<RestauranteEntity>;
  let restaurantesList = [];
  let ciudadData = new CiudadEntity();
  let culturaGastronomicaData = new CulturaGastronomicaEntity();
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [RestauranteService],
    }).compile();

    service = module.get<RestauranteService>(RestauranteService);
    restauranteRepository = module.get<Repository<RestauranteEntity>>(getRepositoryToken(RestauranteEntity));
    await seedDatabase();
  
  });

  
  const seedDatabase = async () => {
    restauranteRepository.clear();
    restaurantesList = [];
    const fec: string =  new Date("2018-03-16").toISOString()
    for(let i =0; i< 5; i++) {
      const restaurante: RestauranteEntity = await restauranteRepository.save({
        nombre: faker.lorem.words(), 
        michelin: 2, 
        fechaMichelin: fec
      })
      restaurantesList.push(restaurante);
    }
  }

  it('findAll debe retornar el listado de restaurantes', async () => {
    const restaurantes: RestauranteEntity[] = await service.findAll();
    expect(restaurantes).not.toBeNull();
    expect(restaurantes).toHaveLength(restaurantesList.length);
  });

  it('findOne debe retornar un restaurante identificada con un id', async () => {
    const storedRestaurante: RestauranteEntity = restaurantesList[0];
    const restaurante: RestauranteEntity = await service.findOne(storedRestaurante.id);
    expect(restaurante).not.toBeNull();
    expect(restaurante.nombre).toEqual(storedRestaurante.nombre)
    expect(restaurante.michelin).toEqual(storedRestaurante.michelin)
    expect(restaurante.fechaMichelin).toEqual(storedRestaurante.fechaMichelin)
  });

  it('findOne debe generar una excepcion al solicitar una restaurante invalido', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "El restaurante con el id proporcionado no ha sido encontrado.")
  });

  it('create debe crear un nuevo restaurante', async () => {
 
    const fec: string =  new Date("2018-03-16").toISOString()
    const restaurante: RestauranteEntity = {
      id: "",
      nombre: faker.lorem.words(), 
      michelin: 2, 
      fechaMichelin: fec,
      ciudad: ciudadData,
      culturagastronomica: culturaGastronomicaData
    }

    const newRestaurante: RestauranteEntity = await service.create(restaurante);
    expect(newRestaurante).not.toBeNull();

    const storedRestaurante: RestauranteEntity = await restauranteRepository.findOne({where: {id: newRestaurante.id}})
    expect(storedRestaurante).not.toBeNull();
    expect(restaurante.nombre).toEqual(storedRestaurante.nombre)
    expect(restaurante.michelin).toEqual(storedRestaurante.michelin)
    expect(restaurante.fechaMichelin).toEqual(storedRestaurante.fechaMichelin)

  });

  it('update debe actualizar un restaurante', async () => {
    const restaurante: RestauranteEntity = restaurantesList[0];
    restaurante.nombre = "Nuevo nombre";
    restaurante.michelin = 2;
    restaurante.fechaMichelin = new Date("2000-01-01").toISOString()

  
    const updatedRestaurante: RestauranteEntity = await service.update(restaurante.id, restaurante);
    expect(updatedRestaurante).not.toBeNull();
  
    const storedRestaurante: RestauranteEntity = await restauranteRepository.findOne({ where: { id: restaurante.id } })
    expect(storedRestaurante).not.toBeNull();
    expect(storedRestaurante.nombre).toEqual(restaurante.nombre);
    expect(storedRestaurante.michelin).toEqual(restaurante.michelin);
    expect(storedRestaurante.fechaMichelin).toEqual(restaurante.fechaMichelin);

  });

  it('update arroja una excepcion para una restaurante invalido', async () => {
    let restaurante: RestauranteEntity = restaurantesList[0];
    restaurante = {
      ...restaurante, nombre: "Nuevo nombre", michelin:1, fechaMichelin: "Nueva fecha"
    }
    await expect(() => service.update("0", restaurante)).rejects.toHaveProperty("message", "El restaurante con el id proporcionado no ha sido encontrado.")
  });

  it('delete debe eliminar una restaurante', async () => {
    const restaurante: RestauranteEntity = restaurantesList[0];
    await service.delete(restaurante.id);
  
    const deletedRestaurante: RestauranteEntity = await restauranteRepository.findOne({ where: { id: restaurante.id } })
    expect(deletedRestaurante).toBeNull();
  });

  it('delete arroja una excepcion para un restaurante invalida', async () => {
    const restaurante: RestauranteEntity = restaurantesList[0];
    await service.delete(restaurante.id);
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "El restaurante con el id proporcionado no ha sido encontrado.")
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});