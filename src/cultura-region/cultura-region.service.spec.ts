import { faker } from "@faker-js/faker";
import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken, TypeOrmModule } from "@nestjs/typeorm";
import { CulturaGastronomicaEntity } from "../culturagastronomica/culturagastronomica.entity";
import { RegionEntity } from "../region/region.entity";
import { TypeOrmTestingConfig } from "../shared/testing-utils/typeorm-testing-config";
import { Repository } from "typeorm";
import { CulturaRegionService } from "./cultura-region.service";

describe('CulturaRegion', () => {
    let service: CulturaRegionService;
    let culturaRepository: Repository<CulturaGastronomicaEntity>;
    let regionRepository: Repository<RegionEntity>;
    let culturaList: CulturaGastronomicaEntity[];

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [...TypeOrmTestingConfig()],
            providers: [CulturaRegionService]
        }).compile();
        service = module.get<CulturaRegionService>(CulturaRegionService);
        culturaRepository = module.get<Repository<CulturaGastronomicaEntity>>(getRepositoryToken(CulturaGastronomicaEntity));
        regionRepository = module.get<Repository<RegionEntity>>(getRepositoryToken(RegionEntity));
        await seeDatabase();
    });

    const seeDatabase = async () => {
        culturaRepository.clear();
        regionRepository.clear();
        culturaList = [];
        const region = new RegionEntity();
        region.nombre = faker.commerce.productName();
        for(let i=0; i < 5; i++){
            const cultura: CulturaGastronomicaEntity = await culturaRepository.save({
                nombre: faker.company.name(),
                descripcion: faker.commerce.productDescription(),
                region: region,
                recetas: [],
                paises: []
            })
            culturaList.push(cultura);
        }
    }

    it('debe ser definido', () =>{
        expect(service).toBeDefined();
    });

    it('addCulturaRegion agregar Cultura a Region', async () => {
        const newRegion: RegionEntity = await regionRepository.save({
            nombre: faker.commerce.productName()
        })
        const newCulturaGastronomica: CulturaGastronomicaEntity = await culturaRepository.save({
            nombre: faker.company.name(),
            descripcion: faker.commerce.productDescription(),
        })
        
        const resultado: CulturaGastronomicaEntity = await service.addCulturaRegion(newCulturaGastronomica.id, newRegion.id);
        expect(resultado.region.id).not.toBeNull;

    });

    it('findCulturaRegionId econtrar Cultura por una id region ', async () =>{
        const region: RegionEntity = culturaList[0].region;
        const storedCultura: CulturaGastronomicaEntity = await service.findCulturaPorRegionId(region.id);
        expect(storedCultura).not.toBeNull();
    });

    it('findCulturaRegionId econtrar Cultura por una id region no existente ', async () =>{
        await expect(() => service.findCulturaPorRegionId("0")).rejects.toHaveProperty("message", "La region id no ha sido encontrada")
    });

    it('findRegionCultura econtrar Cultura por una id region no existente ', async () =>{
        await expect(() => service.findRegionPorCulturaId("0")).rejects.toHaveProperty("message", "La cultura con id no ha sido encontrada")
    });

    it('findRegionCulturaId econtrar region por una id cultura ', async () =>{
        const newRegion: RegionEntity = await regionRepository.save({
            nombre: faker.commerce.productName()
        })
        const newCulturaGastronomica: CulturaGastronomicaEntity = await culturaRepository.save({
            nombre: faker.company.name(),
            descripcion: faker.commerce.productDescription(),
            region: newRegion
        })
        const storedRegion: RegionEntity = await service.findRegionPorCulturaId(newCulturaGastronomica.id);
        expect(storedRegion).not.toBeNull();
        expect(storedRegion.nombre).toBe(newRegion.nombre);
    });

    it('UpdateRegion associateRegionaCulturaId', async () =>{
        const newRegion: RegionEntity = await regionRepository.save({
            nombre: faker.commerce.productName()
        })
        const newCulturaGastronomica: CulturaGastronomicaEntity = await culturaRepository.save({
            nombre: faker.company.name(),
            descripcion: faker.commerce.productDescription(),
            region: newRegion
        })
        const updateCultura: CulturaGastronomicaEntity = await service.associateRegionaCulturaId(newCulturaGastronomica.id, newRegion);
        expect(updateCultura).not.toBeNull();
        expect(updateCultura.region.nombre).toBe(newRegion.nombre);
    });

    it('deleteRegionIdCulturaId eliminar una cultura no existente',async () => {
        const newRegion: RegionEntity = await regionRepository.save({
            nombre: faker.commerce.productName()
        })
        const newCulturaGastronomica: CulturaGastronomicaEntity = await culturaRepository.save({
            nombre: faker.company.name(),
            descripcion: faker.commerce.productDescription(),
            region: newRegion
        })

        await service.deleteRegionIdCulturaId(newCulturaGastronomica.id, newRegion.id);
        await expect(() => service.deleteRegionIdCulturaId("0",newRegion.id)).rejects.toHaveProperty("message", "La cultura con id no ha sido encontrada")
    });
});