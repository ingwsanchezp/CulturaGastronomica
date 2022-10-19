import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { CulturaGastronomicaEntity } from '../culturagastronomica/culturagastronomica.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';
import { RegionEntity } from '../region/region.entity';
import { PaisEntity } from '../pais/pais.entity';
import { PaisCulturaService } from './pais-cultura.service';

describe('PaisCulturaService', () => {
  let service: PaisCulturaService;
  let culturaGastronomicaRepository: Repository<CulturaGastronomicaEntity>;
  let paisRepository: Repository<PaisEntity>;
  let pais: PaisEntity;
  let culturagastronomica: CulturaGastronomicaEntity;
  let region: RegionEntity;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [PaisCulturaService],
    }).compile();

    service = module.get<PaisCulturaService>(PaisCulturaService);
    culturaGastronomicaRepository = module.get<Repository<CulturaGastronomicaEntity>>(getRepositoryToken(CulturaGastronomicaEntity));
    paisRepository = module.get<Repository<PaisEntity>>(getRepositoryToken(PaisEntity));
  
    await seedDatabase();
  });


  const seedDatabase = async () => {
    paisRepository.clear();
    culturaGastronomicaRepository.clear();

    pais = await paisRepository.save({
      nombre: faker.address.country()
    });

    region = new RegionEntity();
    region.nombre = faker.commerce.productName();
    culturagastronomica = await culturaGastronomicaRepository.save({
      nombre: faker.company.name(),
      descripcion: faker.commerce.productDescription(),
      region: region,
      recetas: [],
      paises: [pais],
    })
  }
    

  it('el servicio debe estar definido', () => {
    expect(service).toBeDefined();
  });

  
  it('addPaisToCultura debe agregar un pais a una cultura', async () => {
    const newCultura: CulturaGastronomicaEntity = await culturaGastronomicaRepository.save({
      nombre: faker.company.name(),
      descripcion: faker.commerce.productDescription(),
    })

    const newPais: PaisEntity = await paisRepository.save({
      nombre: faker.address.country(),
      culturasgastronomicas: [],
    })

    const resultado: CulturaGastronomicaEntity= await service.addPaisToCultura(newCultura.id, newPais.id);

    expect(resultado.paises.length).toBe(1);
    expect(resultado.paises[0]).not.toBeNull();
    expect(resultado.paises[0].nombre).toBe(newPais.nombre);

  });


  it('addPaisToCultura debe producir una excepcion para un pais invalido', async () => {
    const newCulturaGastronomica: CulturaGastronomicaEntity = await culturaGastronomicaRepository.save({
      nombre: faker.company.name(),
      descripcion: faker.commerce.productDescription(),
    })
  
    await expect(() => service.addPaisToCultura(newCulturaGastronomica.id, "0")).rejects.toHaveProperty("message", "El pais con el id proporcionado no ha sido encontrado");
  });

  it('addPaisToCultura debe producir una excepcion para una cultura gastronomica invalida', async () => {
    const newPais: PaisEntity = await paisRepository.save({
      nombre: faker.address.country(),
      culturasgastronomicas: [],
    });

    await expect (() => service.addPaisToCultura("0", newPais.id)).rejects.toHaveProperty("message", "La cultura gastronomica con el id proporcionado no ha sido encontrada");
  });

  it('findPaisFromCultura debe retornar un pais desde una cultura gastronomica', async () => {
    const cultura: CulturaGastronomicaEntity = await culturaGastronomicaRepository.save(culturagastronomica)
    const storedPais: PaisEntity = await service.findPaisFromCultura(cultura.id, pais.id )
    expect(storedPais).not.toBeNull();
    expect(storedPais.nombre).toBe(pais.nombre);
  });

  it('findPaisFromCultura debe arrojar una excepcion para una cultura invalida', async () => {
    await expect(()=> service.findPaisFromCultura("0", pais.id)).rejects.toHaveProperty("message", "La cultura gastronomica con el id proporcionado no ha sido encontrada"); 
  });

  it('findPaisFromCultura debe arrojar una excepcion para un pais invalido', async () => {
    await expect(()=> service.findPaisFromCultura(culturagastronomica.id, "0")).rejects.toHaveProperty("message", "El pais con el id proporcionado no ha sido encontrado"); 
  });

  it('findPaisFromCultura debe arrojar una excepcion para una cultura gastronomica no asociada a un pais', async () => {
    const newPais: PaisEntity = await paisRepository.save({
      nombre: faker.address.country()
    });

    await expect(()=> service.findPaisFromCultura(culturagastronomica.id, newPais.id)).rejects.toHaveProperty("message", "El pais con el id proporcionado no esta asociado a la cultura gastronomica"); 
  });

  it('findPaisesFromCultura debe retornar los paises asociados a una cultura gastronomica', async ()=>{
    const paises: PaisEntity[] = await service.findPaisesFromCultura(culturagastronomica.id);
    expect(paises.length).toBe(1)
  });

  it('findPaisesFromCultura debe arrojar una excepcion para un pais invalido', async ()=>{
    await expect(()=> service.findPaisesFromCultura("0")).rejects.toHaveProperty("message", "La cultura gastronomica con el id proporcionado no ha sido encontrada");
  });

  it('findCulturasFromPais debe retornar las culturas gastronomicas de un pais', async ()=>{
    const culturas: CulturaGastronomicaEntity[] = await service.findCulturasFromPais(pais.id);
    expect(culturas.length).toBe(1)
  });

  it('findCulturasFromPais debe arrojar una excepcion para un pais invalido', async () => {

    await expect(()=> service.findCulturasFromPais("0")).rejects.toHaveProperty("message", "El pais con el id proporcionado no ha sido encontrado"); 
  });



  it('updateCulturasFromPais debe actualizar la lista de culturas gastronomicas de un pais', async () => {
    const newPais: PaisEntity = await paisRepository.save({
      nombre: faker.address.country()
    });
    const updatedCulturaGastronomica: CulturaGastronomicaEntity = await service.updateCulturasPais(culturagastronomica.id, newPais);
    expect(updatedCulturaGastronomica.paises.length).toBe(2);
    expect(updatedCulturaGastronomica.paises[1].nombre).toBe(newPais.nombre);
  });

  it('updateCulturasFromPais debe arrojar una excepcion para un pais invalido', async () => {
    const newPais: PaisEntity = await paisRepository.save({
      nombre: faker.address.country()
    });
    newPais.id = "0"

    await expect(()=> service.updateCulturasPais(culturagastronomica.id, newPais)).rejects.toHaveProperty("message", "El pais con el id proporcionado no ha sido encontrado"); 
  });

  it('updateCulturasFromPais debe arrojar una excepcion para una cultura gastronomica invalida', async () => {
    const newPais: PaisEntity = await paisRepository.save({
      nombre: faker.address.country()
    });
   culturagastronomica.id = "0";

    await expect(()=> service.updateCulturasPais(culturagastronomica.id, newPais)).rejects.toHaveProperty("message", "La cultura gastronomica con el id proporcionado no ha sido encontrada"); 
  });

  it('deleteCulturaFromPais debe eliminar una cultura gastronomica de un pais', async () => {
    
    await service.deletePaisFromCultura(culturagastronomica.id, pais.id);  
    const storedCulturaGastronomica: CulturaGastronomicaEntity = await culturaGastronomicaRepository.findOne({where: {id: culturagastronomica.id}, relations: ["paises"]});
    const deletedPais: PaisEntity = storedCulturaGastronomica.paises.find(p => p.id === pais.id);

    expect(deletedPais).toBeUndefined();

  });

  it('deleteCulturaFromPais debe arrojar una excepcion para una cultura gastronomica invalida', async () => {
    await expect(()=> service.deletePaisFromCultura("0", pais.id)).rejects.toHaveProperty("message", "La cultura gastronomica con el id proporcionado no ha sido encontrada"); 
  });

  it('deleteCulturaFromPais debe arrojar una excepcion para un pais invalido', async () => {
    await expect(()=> service.deletePaisFromCultura(culturagastronomica.id, "0")).rejects.toHaveProperty("message", "El pais con el id proporcionado no ha sido encontrado"); 
  });


  
});