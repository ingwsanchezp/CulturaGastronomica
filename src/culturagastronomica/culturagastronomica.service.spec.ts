import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { CulturaGastronomicaEntity } from './culturagastronomica.entity';
import { CulturagastronomicaService } from './culturagastronomica.service';
import { faker } from '@faker-js/faker';
import { RegionEntity } from '../region/region.entity';
import { CacheModule } from '@nestjs/common';



describe('CulturagastronomicaService', () => {
    let service: CulturagastronomicaService;
    let repository: Repository<CulturaGastronomicaEntity>;
    let culturaList: CulturaGastronomicaEntity[];
    let regionData = new RegionEntity();
    let culturaGastronomicaData = new CulturaGastronomicaEntity();

    beforeEach(async () =>{
        const module: TestingModule = await Test.createTestingModule({
            imports: [...TypeOrmTestingConfig(), CacheModule.register()],
            providers: [CulturagastronomicaService],
        }).compile();

        service = module.get<CulturagastronomicaService>(CulturagastronomicaService);
        repository = module.get<Repository<CulturaGastronomicaEntity>>(getRepositoryToken(CulturaGastronomicaEntity));
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
            })
            culturaList.push(cultura);
            
        }
    }

    const loadData = async () =>{

        regionData.nombre = faker.commerce.productName();
        culturaGastronomicaData.nombre = faker.company.name();
        culturaGastronomicaData.descripcion = faker.commerce.productDescription();
        culturaGastronomicaData.region= regionData;
    }

    it('debe ser definido', () =>{
        expect(service).toBeDefined();
    });

    it('findAll debe retornar todo listado de culturas gastronomicas', async () =>{
        const cultura: CulturaGastronomicaEntity[] = await service.findAll();
        expect(cultura).not.toBeNull();
        expect(cultura).toHaveLength(culturaList.length);
    });

    it('findOne debe retornar una cultura gastronomica por id', async () => {
        const storedCulturaGastronomica: CulturaGastronomicaEntity = culturaList[0];
        const cultura: CulturaGastronomicaEntity = await service.finOne(storedCulturaGastronomica.id);
        expect(cultura).not.toBeNull;
        expect(cultura.nombre).toEqual(storedCulturaGastronomica.nombre)
        expect(cultura.descripcion).toEqual(storedCulturaGastronomica.descripcion)
    });

    it('findOne lanzar excepcion para una cultura gastronomica invalida', async () => {
        await expect(() => service.finOne("0")).rejects.toHaveProperty("message", "La cultura gastronomica con el id no a sido encontrada")
    });

    it('Crear una cultura gastronomica nueva', async () => {
        await loadData();
        const newCultura: CulturaGastronomicaEntity = await service.create(culturaGastronomicaData);
        expect(newCultura).not.toBeNull();

        const cultura: CulturaGastronomicaEntity = await service.finOne(newCultura.id);
        expect(cultura).not.toBeNull;
        expect(cultura.nombre).toEqual(newCultura.nombre)
        expect(cultura.descripcion).toEqual(newCultura.descripcion)
    });

    it('Actualizar o modificar una cultura gastronomica', async ()=> {
        const cultura: CulturaGastronomicaEntity = culturaList[0];
        cultura.nombre = "Nuevo nombre";
        cultura.descripcion = "Nueva descripcion";
        const updatedCultura: CulturaGastronomicaEntity = await service.update(cultura.id, cultura);
        expect(updatedCultura).not.toBeNull();
        const storedCultura: CulturaGastronomicaEntity = await repository.findOne({ where: { id: cultura.id } })
        expect(storedCultura).not.toBeNull();
        expect(storedCultura.nombre).toEqual(cultura.nombre)
        expect(storedCultura.descripcion).toEqual(cultura.descripcion)
    });

    it('update actualizacion invalida dado a una cultura invalida', async () => {
        let cultura: CulturaGastronomicaEntity = culturaList[0];
        cultura = {
          ...cultura, nombre: "New name", descripcion: "New address"
        }
        await expect(() => service.update("0", cultura)).rejects.toHaveProperty("message", "La cultura gastronomica con el id no a sido encontrada")
      });

    it('delete eliminar una cultura gastronomica', async () => {
       const cultura: CulturaGastronomicaEntity = culturaList[0];
       await service.delete(cultura.id);
       const deletedCultura: CulturaGastronomicaEntity = await repository.findOne({ where: { id: cultura.id } })
       expect(deletedCultura).toBeNull();
    });

    it('delete fallido por una cultura gastronomica invalida', async () => {
        const cultura: CulturaGastronomicaEntity = culturaList[0];
        await service.delete(cultura.id);
        await expect(() => service.delete("0")).rejects.toHaveProperty("message", "La cultura gastronomica con el id no a sido encontrada")
    });

});