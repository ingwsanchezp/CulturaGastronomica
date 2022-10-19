import { faker } from "@faker-js/faker";
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from "@nestjs/typeorm";
import { TypeOrmTestingConfig } from "../shared/testing-utils/typeorm-testing-config";
import { RestauranteEntity } from '../restaurante/restaurante.entity';
import { CiudadService } from '../ciudad/ciudad.service';
import { CiudadEntity } from '../ciudad/ciudad.entity';

import { Repository } from "typeorm/repository/Repository";

describe('CiudadService', () => {
  let service: CiudadService;
  let repository: Repository<CiudadEntity>;
  let CiudadesList: CiudadEntity[];
  let restaurantesList: RestauranteEntity[];

    beforeEach(async () =>{
      const module: TestingModule = await Test.createTestingModule({
          imports: [...TypeOrmTestingConfig()],
          providers: [CiudadService],
      }).compile();

      service = module.get<CiudadService>(CiudadService);
      repository = module.get<Repository<CiudadEntity>>(getRepositoryToken(CiudadEntity));
      await seeDatabase();
    });

    const seeDatabase = async () =>{
      repository.clear();
      CiudadesList = [];
      //restaurantesList = []
      //restaurante.nombre = faker.commerce.productName();
      const restaurante = new RestauranteEntity();

      for(let i = 0; i < 5; i++){

        const Ciudad: CiudadEntity = await repository.save({
              nombre: faker.address.cityName()
              //restaurantes: restaurantesList,
          })
          CiudadesList.push(Ciudad);
          
      }
      restaurante.nombre = faker.company.name();
      restaurante.michelin = 2;
      restaurante.fechaMichelin= faker.date.birthdate().toString();
      
    }

    it('el servicio debe estar definido', () =>{
        expect(service).toBeDefined();
    });

    it('findAll debe retornar todos los Ciudades', async () =>{
        const Ciudades: CiudadEntity[] = await service.findAll();
        expect(Ciudades).not.toBeNull();
        expect(Ciudades).toHaveLength(CiudadesList.length);
    });

    it('findOne debe retornar un Ciudad por id', async () => {
        const storedCiudad: CiudadEntity = CiudadesList[0];
        const Ciudad: CiudadEntity = await service.findOne(storedCiudad.id);
        expect(Ciudad).not.toBeNull;
        expect(Ciudad.nombre).toEqual(storedCiudad.nombre)
    });

    it('findOne lanzar excepcion para un Ciudad invalido', async () => {
        await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "El Ciudad con el id proporcionado no ha sido encontrado")
    });

});

