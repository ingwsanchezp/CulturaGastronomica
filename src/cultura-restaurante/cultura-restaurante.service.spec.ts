import { Test, TestingModule } from '@nestjs/testing';
import { CulturaGastronomicaEntity } from '../culturagastronomica/culturagastronomica.entity';
import { RestauranteEntity } from '../restaurante/restaurante.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { CulturaRestauranteService } from './cultura-restaurante.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';
import { RegionEntity } from '../region/region.entity';
import { CiudadEntity } from '../ciudad/ciudad.entity';
import { PaisEntity } from '../pais/pais.entity';
import { RecetaEntity } from '../receta/receta.entity';

describe('CulturaRestauranteService', () => {
  let service: CulturaRestauranteService;
  let culturaRepository: Repository<CulturaGastronomicaEntity>;
  let restauranteRepository: Repository<RestauranteEntity>;
  let culturaList: CulturaGastronomicaEntity[];
  let restaurantesList: RestauranteEntity[];
  let culturagastronomica: CulturaGastronomicaEntity;
  let paisesList: PaisEntity[];
  let recetasList: RecetaEntity[];
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [CulturaRestauranteService],
    }).compile();
    service = module.get<CulturaRestauranteService>(CulturaRestauranteService);
    culturaRepository = module.get<Repository<CulturaGastronomicaEntity>>(getRepositoryToken(CulturaGastronomicaEntity));
    restauranteRepository = module.get<Repository<RestauranteEntity>>(getRepositoryToken(RestauranteEntity));
    await seeDatabase();
  
  });


  const seeDatabase = async () => {
    culturaRepository.clear();
    restauranteRepository.clear();

    restaurantesList = [];
    const ciudad = new CiudadEntity();
    ciudad.nombre= faker.address.city()

    const fec: string =  new Date("2018-03-16").toISOString()
    for(let i =0; i< 5; i++) {
      const restaurante: RestauranteEntity = await restauranteRepository.save({
        nombre: faker.lorem.words(), 
        michelin: 2, 
        fechaMichelin: fec
      })
      restaurantesList.push(restaurante);
      
    }


    const region = new RegionEntity();
    region.nombre = faker.commerce.productName();
    paisesList:  paisesList = []; 
    recetasList: recetasList= [];
    culturagastronomica = await culturaRepository.save({
      nombre: faker.company.name(),
      descripcion: faker.commerce.productDescription(),
      region: region,
      recetas: recetasList,
      restaurantes: restaurantesList,
      paises: paisesList,
    })
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

   
  it('addCulturaRestaurante agregar un Restaurante a una Cultura', async () => {
    const fec: string =  new Date("2018-03-16").toISOString()
    const newRestaurante: RestauranteEntity = await restauranteRepository.save({
        nombre: faker.company.name(),
        michelin: 2,
        fechaMichelin: fec 

    })
    const newCulturaGastronomica: CulturaGastronomicaEntity = await culturaRepository.save({
        nombre: faker.company.name(),
        descripcion: faker.commerce.productDescription(),
    })
    
    const resultado: CulturaGastronomicaEntity = await service.addRestauranteCultura(newCulturaGastronomica.id, newRestaurante.id);
    expect(resultado.restaurantes.length).toBe(1);
    expect(resultado.restaurantes[0]).not.toBeNull();
    expect(resultado.restaurantes[0].nombre).toBe(newRestaurante.nombre);
    expect(resultado.restaurantes[0].michelin).toBe(newRestaurante.michelin);
    expect(resultado.restaurantes[0].fechaMichelin).toBe(newRestaurante.fechaMichelin);

  });

  
  it('addCulturaRestaurante debe producir una excepcion para un restaurante invalido', async () => {
    const newCulturaGastronomica: CulturaGastronomicaEntity = await culturaRepository.save({
      nombre: faker.company.name(),
      descripcion: faker.commerce.productDescription(),
    })
  
    await expect(() => service.addRestauranteCultura(newCulturaGastronomica.id, "0")).rejects.toHaveProperty("message", "El restaurante con el id proporcionado no ha sido encontrado");
  });

  it('addCulturaRestaurante debe producir una excepcion para una cultura gastronomica invalida', async () => {
    const fec: string =  new Date("2018-03-16").toISOString()
    const newRestaurante: RestauranteEntity = await restauranteRepository.save({
      nombre: faker.company.name(),
      michelin: 2,
      fechaMichelin: fec 
    })

    await expect (() => service.addRestauranteCultura("0", newRestaurante.id)).rejects.toHaveProperty("message", "La cultura gastronomica con el id proporcionado no ha sido encontrada");
  });

  it('findRestauranteByCulturaIdRestauranteId debe retornar un restaurante de una cultura gastronomica', async () => {
    const restaurante: RestauranteEntity = restaurantesList[0];
    const storedRestaurante: RestauranteEntity = await service.findRestauranteByCulturaIdRestauranteId(culturagastronomica.id, restaurante.id, )
    expect(storedRestaurante).not.toBeNull();
    expect(storedRestaurante.nombre).toBe(restaurante.nombre);
    expect(storedRestaurante.michelin).toBe(restaurante.michelin);
    expect(storedRestaurante.fechaMichelin).toBe(restaurante.fechaMichelin);
  });

  it('findRestauranteByCulturaIdRestauranteId debe arrojar una excepcion para un restaurante invalido', async () => {
    await expect(()=> service.findRestauranteByCulturaIdRestauranteId(culturagastronomica.id, "0")).rejects.toHaveProperty("message", "El restaurante con el id proporcionado no ha sido encontrado"); 
  });

  it('findRestauranteByCulturaIdRestauranteId debe arrojar una excepcion para una cultura gastronomica invalida', async () => {
    const restaurante: RestauranteEntity = restaurantesList[0];
    await expect(()=> service.findRestauranteByCulturaIdRestauranteId("0", restaurante.id)).rejects.toHaveProperty("message", "La cultura gastronomica con el id proporcionado no ha sido encontrada"); 
  });

  it('findRestauranteByCulturaIdRestauranteId debe arrojar una excepcion para una receta no asociada a una cultura gastronomica', async () => {
    const fec: string =  new Date("2018-03-16").toISOString()
    const newRestaurante: RestauranteEntity = await restauranteRepository.save({
      nombre: faker.company.name(),
      michelin: 2,
      fechaMichelin: fec 
    })

    await expect(()=> service.findRestauranteByCulturaIdRestauranteId(culturagastronomica.id, newRestaurante.id)).rejects.toHaveProperty("message", "El restaurante con el id proporcionado no esta asociado a la cultura gastronomica"); 
  });

  it('findRestauranteByCulturaId debe retornar los restaurantes de una cultura gastronomica', async ()=>{
    const restaurantes: RestauranteEntity[] = await service.findRestaurantesByCulturaId(culturagastronomica.id);
    expect(restaurantes.length).toBe(5)
  });

  it('findRestauranteByCulturaId debe arrojar una excepcion para una cultura gastronomica invalida', async () => {
    await expect(()=> service.findRestaurantesByCulturaId("0")).rejects.toHaveProperty("message", "La cultura gastronomica con el id proporcionado no ha sido encontrada"); 
  });

  it('associateRestauranteCultura debe actualizar la lista de restaurantes de una cultura gastronomica', async () => {
    const fec: string =  new Date("2018-03-16").toISOString()
    const newRestaurante: RestauranteEntity = await restauranteRepository.save({
      nombre: faker.company.name(),
      michelin: 2,
      fechaMichelin: fec 
    })

    const updatedCulturaGastronomica: CulturaGastronomicaEntity = await service.associateRestauranteCultura(culturagastronomica.id, [newRestaurante]);
    expect(updatedCulturaGastronomica.restaurantes.length).toBe(1);

    expect(updatedCulturaGastronomica.restaurantes[0].nombre).toBe(newRestaurante.nombre);
    expect(updatedCulturaGastronomica.restaurantes[0].michelin).toBe(newRestaurante.michelin);
    expect(updatedCulturaGastronomica.restaurantes[0].fechaMichelin).toBe(newRestaurante.fechaMichelin);

  });

  it('associateRestauranteCultura debe arrojar una excepcion para una cultura gastronomica invalida', async () => {
    const fec: string =  new Date("2018-03-16").toISOString()
    const newRestaurante: RestauranteEntity = await restauranteRepository.save({
      nombre: faker.company.name(),
      michelin: 2,
      fechaMichelin: fec 
    })

    await expect(()=> service.associateRestauranteCultura("0", [newRestaurante])).rejects.toHaveProperty("message", "La cultura gastronomica con el id proporcionado no ha sido encontrada"); 
  });

  it('associateRestauranteCultura debe arrojar una excepcion para un restaurante invalido', async () => {
    const newRestaurante: RestauranteEntity = restaurantesList[0];
    newRestaurante.id = "0";

    await expect(()=> service.associateRestauranteCultura(culturagastronomica.id, [newRestaurante])).rejects.toHaveProperty("message", "El restaurante con el id proporcionado no ha sido encontrado"); 
  });

  it('deleteRestauranteToCultura debe eliminar un restaurante de una cultura gastronomica', async () => {
    const restaurante: RestauranteEntity = restaurantesList[0];
    
    await service.deleteRestauranteToCultura(culturagastronomica.id, restaurante.id);

    const storedCulturaGastronomica: CulturaGastronomicaEntity = await culturaRepository.findOne({where: {id: culturagastronomica.id}, relations: ["restaurantes"]});
    const deletedRestaurante: RestauranteEntity = storedCulturaGastronomica.restaurantes.find(a => a.id === restaurante.id);

    expect(deletedRestaurante).toBeUndefined();

  });

  it('deleteRestauranteToCultura debe arrojar una excepcion para un restaurante invalido', async () => {
    await expect(()=> service.deleteRestauranteToCultura(culturagastronomica.id, "0")).rejects.toHaveProperty("message", "El restaurante con el id proporcionado no ha sido encontrado"); 
  });

  it('deleteRestauranteToCultura debe arrojar una excepcion para una cultura gastronomica invalida', async () => {
    const restaurante: RestauranteEntity = restaurantesList[0];
    await expect(()=> service.deleteRestauranteToCultura("0", restaurante.id)).rejects.toHaveProperty("message", "La cultura gastronomica con el id proporcionado no ha sido encontrada"); 
  });

  it('deleteRestauranteToCultura debe arrojar una excepcion para un restaurante no asociado a una cultura gastronomica', async () => {
    const fec: string =  new Date("2018-03-16").toISOString()
    const newRestaurante: RestauranteEntity = await restauranteRepository.save({
      nombre: faker.company.name(),
      michelin: 2,
      fechaMichelin: fec 
    })


    await expect(()=> service.deleteRestauranteToCultura(culturagastronomica.id, newRestaurante.id)).rejects.toHaveProperty("message", "El restaurante con el id proporcionado no esta asociado a la cultura gastronomica"); 
  }); 


});
