import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { CiudadRestauranteService } from './ciudad-restaurante.service';
import { CiudadEntity } from '../ciudad/ciudad.entity';
import { RestauranteEntity } from '../restaurante/restaurante.entity';
import { PaisEntity } from '../pais/pais.entity';
import { RecetaEntity } from '../receta/receta.entity';
import { RegionEntity } from '../region/region.entity';
import { CulturaGastronomicaEntity } from '../culturagastronomica/culturagastronomica.entity';


describe('CiudadRestauranteService', () => {
  let service: CiudadRestauranteService;
  let ciudadRepository: Repository<CiudadEntity>;
  let restauranteRepository: Repository<RestauranteEntity>;
  let culturaRepository: Repository<CulturaGastronomicaEntity>;
  let restaurantesList: RestauranteEntity[];
  let ciudad: CiudadEntity;
  let culturagastronomica: CulturaGastronomicaEntity;
  let paisesList: PaisEntity[];
  let recetasList: RecetaEntity[];
  let productosList = [];
  

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [CiudadRestauranteService],
    }).compile();

    service = module.get<CiudadRestauranteService>(CiudadRestauranteService);
    ciudadRepository = module.get<Repository<CiudadEntity>>(getRepositoryToken(CiudadEntity));
    restauranteRepository = module.get<Repository<RestauranteEntity>>(getRepositoryToken(RestauranteEntity));
    await seeDatabase();

    });
  
    const seeDatabase = async () => {
      ciudadRepository.clear();
      restauranteRepository.clear();
      restaurantesList = [];

      ciudad= new CiudadEntity();
      ciudad.nombre = faker.address.cityName();
      
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

      ciudad = await ciudadRepository.save({
          nombre: faker.address.cityName(),
          restaurantes: restaurantesList
        })
    }
     

    it('should be defined', () => {
      expect(service).toBeDefined();
    });

    it('addCiudadRestaurante agregar un Restaurante a una Ciudad', async () => {
      const fec: string =  new Date("2018-03-16").toISOString()
      
      const newRestaurante: RestauranteEntity = await restauranteRepository.save({
        nombre: faker.company.name(),
        michelin: 2,
        fechaMichelin: fec
      })

      const newCiudad: CiudadEntity = await ciudadRepository.save({
        nombre: faker.company.name()        
      })
          
      const resultado: CiudadEntity = await service.addCiudadRestaurante(newRestaurante.id, newCiudad.id);
      expect(resultado.restaurantes.length).toBe(1);
      expect(resultado.restaurantes[0]).not.toBeNull();
      expect(resultado.restaurantes[0].nombre).toBe(newRestaurante.nombre);
      expect(resultado.restaurantes[0].michelin).toBe(newRestaurante.michelin);
      expect(resultado.restaurantes[0].fechaMichelin).toBe(newRestaurante.fechaMichelin);
    });
    

    it('addCiudadRestaurante debe producir una excepcion para una ciudad invalida', async () => {
      const newCiudad: CiudadEntity = await ciudadRepository.save({
        nombre: faker.company.name(),
        descripcion: faker.commerce.productDescription(),
      })
    
      await expect(() => service.addCiudadRestaurante("0", newCiudad.id)).rejects.toHaveProperty("message", "El Restaurante con el id proporcionado no ha sido encontrado");
    });

    it('addCiudadRestaurante debe producir una excepcion para un restaurante invalido', async () => {
      const fec: string =  new Date("2018-03-16").toISOString()
      const newRestaurante: RestauranteEntity = await restauranteRepository.save({
        nombre: faker.company.name(),
        michelin: 3,
        fechaMichelin: fec
      })
    
      await expect(() => service.addCiudadRestaurante(newRestaurante.id,"0")).rejects.toHaveProperty("message", "La Ciudad con el id proporcionado no ha sido encontrado");
    });

    
    it('findRestaranteByCiudadIdRestauranteId debe retornar el restaurante de una ciudad', async () => {
    
      const storedRestaurante: RestauranteEntity = await service.findRestaranteByCiudadIdRestauranteId(restaurantesList[0].id, ciudad.id)
      
      expect(storedRestaurante).not.toBeNull();
      expect(storedRestaurante.nombre).toBe(restaurantesList[0].nombre);
      expect(storedRestaurante.michelin).toBe(restaurantesList[0].michelin);
      expect(storedRestaurante.fechaMichelin).toBe(restaurantesList[0].fechaMichelin);
    });
  

    
    it('findRestarantesByCiudadId debe arrojar una excepcion para una ciudad invalida', async () => {
      // const restaurante: RestauranteEntity = restaurantesList[0];
      await expect(()=> service.findRestarantesByCiudadId("0")).rejects.toHaveProperty("message", "La Ciudad con el id proporcionado no ha sido encontrada"); 
    });
    
 
    it('associateRestauranteCiudad debe actualizar la lista de restaurante de una ciudad', async () => {

      const fec: string =  new Date("2018-03-16").toISOString()
      const newRestaurante: RestauranteEntity = await restauranteRepository.save({
        nombre: faker.company.name(),
        michelin: 2,
        fechaMichelin: fec 
      })
     

      const updatedCiudad: CiudadEntity = await service.associateRestauranteCiudad(ciudad.id, [newRestaurante]);
      expect(updatedCiudad.restaurantes.length).toBe(1);
      expect(updatedCiudad.restaurantes[0]).not.toBeNull();
      expect(updatedCiudad.restaurantes[0].nombre).toBe(newRestaurante.nombre);
      expect(updatedCiudad.restaurantes[0].michelin).toBe(newRestaurante.michelin);
      expect(updatedCiudad.restaurantes[0].fechaMichelin).toBe(newRestaurante.fechaMichelin);

    });
    
         
    it('deleteRestauranteToCiudad debe eliminar un restaurante de una ciudad', async () => {
      const restaurante: RestauranteEntity = restaurantesList[0];
      
      await service.deleteRestauranteToCiudad(ciudad.id, restaurante.id);
  
      const storedCiudad: CiudadEntity = await ciudadRepository.findOne({where: {id: ciudad.id}, relations: ["restaurantes"]});
      const deletedRestaurante: RestauranteEntity = storedCiudad.restaurantes.find(a => a.id === restaurante.id);
  
      expect(deletedRestaurante).toBeUndefined();
      
    });
    
});
