import { Test, TestingModule } from '@nestjs/testing';
import { RecetaService } from './receta.service';
import { RecetaEntity } from './receta.entity';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';
import { RegionEntity } from '../region/region.entity';
import { CulturaGastronomicaEntity } from '../culturagastronomica/culturagastronomica.entity';
import { CacheModule } from '@nestjs/common';


describe('RecetaService', () => {
  let service: RecetaService;
  let repository: Repository<RecetaEntity>;
  let recetasList: RecetaEntity[];
  let regionData = new RegionEntity();
  let culturaGastronomicaData = new CulturaGastronomicaEntity();
  let cacheManager: Cache;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig(), CacheModule.register()],
      providers: [RecetaService, ],
    }).compile();

    service = module.get<RecetaService>(RecetaService);
    repository = module.get<Repository<RecetaEntity>>(getRepositoryToken(RecetaEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    recetasList = [];
    for(let i = 0; i < 5; i++){
        const receta: RecetaEntity = await repository.save({
        nombre: faker.lorem.words(), 
        descripcion: faker.lorem.sentence(), 
        foto: faker.image.imageUrl(),
        preparacion: faker.lorem.sentence(), 
        video: faker.internet.url()})
        recetasList.push(receta);
    }
 
    culturaGastronomicaData.nombre = faker.company.name();
    culturaGastronomicaData.descripcion = faker.commerce.productDescription();
    culturaGastronomicaData.region= regionData;
    culturaGastronomicaData.recetas= [];
    culturaGastronomicaData.paises= [];
  }

  it('el servicio debe estar definido', () => {
    expect(service).toBeDefined();
  });

  it('findAll debe retornar el listado de recetas', async () => {
    const recetas: RecetaEntity[] = await service.findAll();
    expect(recetas).not.toBeNull();
    expect(recetas).toHaveLength(recetasList.length);
  });

  it('findOne debe retornar una receta identificada con un id', async () => {
    const storedReceta: RecetaEntity = recetasList[0];
    const receta: RecetaEntity = await service.findOne(storedReceta.id);
    expect(receta).not.toBeNull();
    expect(receta.nombre).toEqual(storedReceta.nombre)
    expect(receta.foto).toEqual(storedReceta.foto)
    expect(receta.preparacion).toEqual(storedReceta.preparacion)
    expect(receta.video).toEqual(storedReceta.video)
  });

  it('findOne debe generar una excepcion al solicitar una receta invalida', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "La receta con el id proporcionado no ha sido encontrada")
  });

  it('create debe crear un nuevo museo', async () => {

    const receta: RecetaEntity = {
      id: "",
      nombre: faker.lorem.words(), 
      descripcion: faker.lorem.sentence(), 
      foto: faker.image.imageUrl(),
      preparacion: faker.lorem.sentence(), 
      video: faker.internet.url(),
      culturagastronomica: culturaGastronomicaData,
    }

    const newReceta: RecetaEntity = await service.create(receta);
    expect(newReceta).not.toBeNull();

    const storedReceta: RecetaEntity = await repository.findOne({where: {id: newReceta.id}})
    expect(storedReceta).not.toBeNull();
    expect(storedReceta.nombre).toEqual(newReceta.nombre)
    expect(storedReceta.descripcion).toEqual(newReceta.descripcion)
    expect(storedReceta.foto).toEqual(newReceta.foto)
    expect(storedReceta.preparacion).toEqual(newReceta.preparacion)
    expect(storedReceta.video).toEqual(newReceta.video)
  });

  it('update debe actualizar una receta', async () => {
    const receta: RecetaEntity = recetasList[0];
    receta.nombre = "Nuevo nombre";
    receta.descripcion = "Nueva descripcion";
    receta.foto = "Nueva foto";
    receta.preparacion = "Nueva preparacion";
    receta.video = "Nuevo video"
  
    const updatedReceta: RecetaEntity = await service.update(receta.id, receta);
    expect(updatedReceta).not.toBeNull();
  
    const storedReceta: RecetaEntity = await repository.findOne({ where: { id: receta.id } })
    expect(storedReceta).not.toBeNull();
    expect(storedReceta.nombre).toEqual(receta.nombre);
    expect(storedReceta.descripcion).toEqual(receta.descripcion);
    expect(storedReceta.foto).toEqual(receta.foto);
    expect(storedReceta.preparacion).toEqual(receta.preparacion);
    expect(storedReceta.video).toEqual(receta.video);

  });

  it('update arroja una excepcion para una receta invalida', async () => {
    let receta: RecetaEntity = recetasList[0];
    receta = {
      ...receta, nombre: "Nuevo nombre", descripcion: "Nueva descripcion", foto: "Nueva foto", preparacion: "Nueva preparacion", video: "Nuevo video"
    }
    await expect(() => service.update("0", receta)).rejects.toHaveProperty("message", "La receta con el id proporcionado no ha sido encontrada.")
  });

  it('delete debe eliminar una receta', async () => {
    const receta: RecetaEntity = recetasList[0];
    await service.delete(receta.id);
  
    const deletedReceta: RecetaEntity = await repository.findOne({ where: { id: receta.id } })
    expect(deletedReceta).toBeNull();
  });

  it('delete arroja una excepcion para una receta invalida', async () => {
    const receta: RecetaEntity = recetasList[0];
    await service.delete(receta.id);
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "La receta con el id proporcionado no ha sido encontrada")
  });

});
