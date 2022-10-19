import { faker } from "@faker-js/faker";
import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { CulturaGastronomicaEntity } from "../culturagastronomica/culturagastronomica.entity";
import { TypeOrmTestingConfig } from "../shared/testing-utils/typeorm-testing-config";
import { Repository } from "typeorm/repository/Repository";
import { RegionEntity } from "../region/region.entity";
import { PaisEntity } from './pais.entity';
import { PaisService } from "./pais.service";
import { PaisDto } from "./pais.dto";
import { CacheModule } from "@nestjs/common";

describe('PaisService', () => {
    let service: PaisService;
    let repository: Repository<PaisEntity>;
    let paisesList: PaisEntity[];
    let regionData = new RegionEntity();
    let culturaGastronomicaData = new CulturaGastronomicaEntity();


    beforeEach(async () =>{
        const module: TestingModule = await Test.createTestingModule({
            imports: [...TypeOrmTestingConfig(), CacheModule.register()],
            providers: [PaisService],
        }).compile();

        service = module.get<PaisService>(PaisService);
        repository = module.get<Repository<PaisEntity>>(getRepositoryToken(PaisEntity));
        await seeDatabase();
    });

    const seeDatabase = async () =>{
        repository.clear();
        paisesList = [];
        const region = new RegionEntity();
        region.nombre = faker.commerce.productName();
        
        for(let i = 0; i < 5; i++){
            const pais: PaisEntity = await repository.save({
                nombre: faker.address.country()
            })
            paisesList.push(pais);
            
        }
        culturaGastronomicaData.nombre = faker.company.name();
        culturaGastronomicaData.descripcion = faker.commerce.productDescription();
        culturaGastronomicaData.region= regionData;
        culturaGastronomicaData.recetas= [];
        culturaGastronomicaData.paises= [];
    }

    
    it('el servicio debe estar definido', () =>{
        expect(service).toBeDefined();
    });

    it('findAll debe retornar todos los paises', async () =>{
        const paises: PaisDto[] = await service.findAll();
        expect(paises).not.toBeNull();
        expect(paises).toHaveLength(paisesList.length);
    });

    it('findOne debe retornar un pais por id', async () => {
        const storedPais: PaisDto = paisesList[0];
        const pais: PaisDto = await service.findOne(storedPais.id);
        expect(pais).not.toBeNull;
        expect(pais.nombre).toEqual(storedPais.nombre)
    });

    it('findOne lanzar excepcion para un pais invalido', async () => {
        await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "El pais con el id proporcionado no ha sido encontrado")
    });

    it('Actualizar o modificar un pais', async ()=> {
        const pais: PaisEntity = paisesList[0];
        pais.nombre = "Nuevo nombre";
        const updatedPais: PaisDto = await service.update(pais.id, pais);
        expect(updatedPais).not.toBeNull();
        const storedPais: PaisDto = await repository.findOne({ where: { id: pais.id } })
        expect(storedPais).not.toBeNull();
        expect(storedPais.nombre).toEqual(pais.nombre)
        
    });
    
    it('update arroja una excepcion para un pais invalido', async () => {
        let pais: PaisEntity = paisesList[0];
        pais = {
          ...pais, nombre: "New name"
        }
        await expect(() => service.update("0", pais)).rejects.toHaveProperty("message", "El pais con el id proporcionado no ha sido encontrado")
      });
    
    it('delete debe eliminar un pais', async () => {
        const pais: PaisEntity = paisesList[0];
        await service.delete(pais.id);
      
        const deletedPais: PaisEntity = await repository.findOne({ where: { id: pais.id } })
        expect(deletedPais).toBeNull();
      });
    

    it('delete arroja una excepcion para un pais invalido', async () => {
         const pais: PaisEntity = paisesList[0];
         await service.delete(pais.id);
         await expect(() => service.delete("0")).rejects.toHaveProperty("message", "El pais con el id proporcionado no ha sido encontrado")
     });
});