import { faker } from "@faker-js/faker";
import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { CulturaGastronomicaEntity } from "../culturagastronomica/culturagastronomica.entity";
import { TypeOrmTestingConfig } from "../shared/testing-utils/typeorm-testing-config";
import { Repository } from "typeorm/repository/Repository";
import { RegionEntity } from "./region.entity";
import { RegionService } from "./region.service";
import { CacheModule } from "@nestjs/common";

describe('RegionService', () => {
    let service: RegionService;
    let repository: Repository<RegionEntity>;
    let culturaList: CulturaGastronomicaEntity[];
    let regionData = new RegionEntity();
    let culturaGastronomicaData = new CulturaGastronomicaEntity();

    beforeEach(async () =>{
        const module: TestingModule = await Test.createTestingModule({
            imports: [...TypeOrmTestingConfig(), CacheModule.register()],
            providers: [RegionService],
        }).compile();

        service = module.get<RegionService>(RegionService);
        repository = module.get<Repository<RegionEntity>>(getRepositoryToken(RegionEntity));
        await seeDatabase();
    });

    const seeDatabase = async () =>{
        repository.clear();
        culturaList = [];
        const region = new RegionEntity();
        region.nombre = faker.commerce.productName();
        
        for(let i = 0; i < 5; i++){
            const cultura: CulturaGastronomicaEntity = await repository.save({
                nombre: faker.company.name(),
                descripcion: faker.commerce.productDescription(),
                region: region,
                recetas: [],
                paises: [],
                productos: [],
                restaurantes: []
            })
            culturaList.push(cultura);
            
        }
    }

    const loadData = async () =>{

        regionData.nombre = faker.commerce.productName();
        culturaGastronomicaData.nombre = faker.company.name();
        culturaGastronomicaData.descripcion = faker.commerce.productDescription();
        culturaGastronomicaData.region= regionData;
        regionData.culturagastronomica = culturaGastronomicaData;
    }

    it('debe ser definido', () =>{
        expect(service).toBeDefined();
    });

    it('findAll debe retornar todas las regiones gastronomicas', async () =>{
        const region: RegionEntity[] = await service.findAll();
        expect(region).not.toBeNull();
        expect(region).toHaveLength(culturaList.length);
    });

    it('findOne debe retornar una region gastronomica por id', async () => {
        const storedCulturaGastronomica: CulturaGastronomicaEntity = culturaList[0];
        const region: RegionEntity = await service.findOne(storedCulturaGastronomica.region.id);
        expect(region).not.toBeNull;
        expect(region.nombre).toEqual(storedCulturaGastronomica.nombre)
    });

    it('findOne lanzar excepcion para una region gastronomica invalida', async () => {
        await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "La region con el id no a sido encontrada")
    });

    it('Actualizar o modificar una region gastronomica', async ()=> {
        const region: RegionEntity = culturaList[0].region;
        region.nombre = "Nuevo nombre";
        const updatedRegion: RegionEntity = await service.update(region.id, region);
        expect(updatedRegion).not.toBeNull();
        const storedRegion: RegionEntity = await repository.findOne({ where: { id: region.id } })
        expect(storedRegion).not.toBeNull();
        expect(storedRegion.nombre).toEqual(region.nombre)
        
    });
    
    it('update actualizacion invalida dado a una region invalida', async () => {
        let region: RegionEntity = culturaList[0].region;
        region = {
          ...region, nombre: "New name"
        }
        await expect(() => service.update("0", region)).rejects.toHaveProperty("message", "La region con el id no a sido encontrada")
      });
    
    it('delete fallido por una region gastronomica invalida', async () => {
         const region: RegionEntity = culturaList[0].region;
         await service.delete(region.id);
         await expect(() => service.delete("0")).rejects.toHaveProperty("message", "La region gastronomica con el id no a sido encontrada")
     });
});