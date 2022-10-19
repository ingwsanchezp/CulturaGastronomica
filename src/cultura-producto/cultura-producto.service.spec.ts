import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CategoriaproductoEntity } from '../categoriaproducto/categoriaproducto.entity';
import { ProductoEntity } from '../producto/producto.entity';
import { Repository } from 'typeorm';
import { CulturaGastronomicaEntity } from '../culturagastronomica/culturagastronomica.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { CulturaProductoService } from './cultura-producto.service';
import { RestauranteEntity } from '../restaurante/restaurante.entity';
import { PaisEntity } from '../pais/pais.entity';
import { RecetaEntity } from '../receta/receta.entity';
import { RegionEntity } from '../region/region.entity';

describe('CulturaProductoService', () => {
  let service: CulturaProductoService;
  let culturaRepository: Repository<CulturaGastronomicaEntity>;
  let productoRepository: Repository<ProductoEntity>;
  let productosList = [];
  let restaurantesList: RestauranteEntity[];
  let culturagastronomica: CulturaGastronomicaEntity;
  let paisesList: PaisEntity[];
  let recetasList: RecetaEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [CulturaProductoService],
    }).compile();
    service = module.get<CulturaProductoService>(CulturaProductoService);
    culturaRepository = module.get<Repository<CulturaGastronomicaEntity>>(getRepositoryToken(CulturaGastronomicaEntity));
    productoRepository = module.get<Repository<ProductoEntity>>(getRepositoryToken(ProductoEntity));
    await seeDatabase();
  
  });

  const seeDatabase = async () => {
    culturaRepository.clear();
    productoRepository.clear();

    productosList = [];
    const categoria= new CategoriaproductoEntity();
    categoria.nombre = faker.commerce.productAdjective();


    for(let i =0; i< 5; i++) {
      const producto: ProductoEntity = await productoRepository.save({
        nombre: faker.lorem.words(), 
        descripcion: faker.lorem.words()
      })
      productosList.push(producto);
      
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
        productos: productosList
      })
    }
  }
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addCulturaProducto agregar un Producto a una Cultura', async () => {
    const newProducto: ProductoEntity = await productoRepository.save({
      nombre: faker.lorem.words(), 
      descripcion: faker.lorem.words()

    })
    const newCulturaGastronomica: CulturaGastronomicaEntity = await culturaRepository.save({
        nombre: faker.company.name(),
        descripcion: faker.commerce.productDescription(),
    })
    
    const resultado: CulturaGastronomicaEntity = await service.addProductoCultura(newCulturaGastronomica.id, newProducto.id);
    expect(resultado.productos.length).toBe(1);
    expect(resultado.productos[0]).not.toBeNull();
    expect(resultado.productos[0].nombre).toBe(newProducto.nombre);
    expect(resultado.productos[0].descripcion).toBe(newProducto.descripcion);

  });

  it('addCulturaProducto debe producir una excepcion para un producto invalido', async () => {
    const newCulturaGastronomica: CulturaGastronomicaEntity = await culturaRepository.save({
      nombre: faker.company.name(),
      descripcion: faker.commerce.productDescription(),
    })
  
    await expect(() => service.addProductoCultura(newCulturaGastronomica.id, "0")).rejects.toHaveProperty("message", "El producto con el id proporcionado no ha sido encontrado");
  });

  it('addCulturaProducto debe producir una excepcion para una cultura gastronomica invalida', async () => {
      const newProducto: ProductoEntity = await productoRepository.save({
      nombre: faker.lorem.words(), 
      descripcion: faker.lorem.words()

    })

    await expect (() => service.addProductoCultura("0", newProducto.id)).rejects.toHaveProperty("message", "La cultura gastronomica con el id proporcionado no ha sido encontrada");
  });

  it('findProductoByCulturaIdProductoId debe retornar un producto de una cultura gastronomica', async () => {
    const producto: ProductoEntity = productosList[0];
    const storedProducto: ProductoEntity = await service.findProductoByCulturaIdProductoId(culturagastronomica.id, producto.id, )
    expect(storedProducto).not.toBeNull();
    expect(storedProducto.nombre).toBe(producto.nombre);
    expect(storedProducto.descripcion).toBe(producto.descripcion);
  });

  it('findProductoByCulturaIdProductoId debe arrojar una excepcion para un producto invalido', async () => {
    await expect(()=> service.findProductoByCulturaIdProductoId(culturagastronomica.id, "0")).rejects.toHaveProperty("message", "El producto con el id proporcionado no ha sido encontrado"); 
  });

  it('findProductoByCulturaIdProductoId debe arrojar una excepcion para una cultura gastronomica invalida', async () => {
    const producto: ProductoEntity = productosList[0];
    await expect(()=> service.findProductoByCulturaIdProductoId("0", producto.id)).rejects.toHaveProperty("message", "La cultura gastronomica con el id proporcionado no ha sido encontrada"); 
  });

  it('findProductoByCulturaIdProductoId debe arrojar una excepcion para un producto no asociada a una cultura gastronomica', async () => {
    const newProducto: ProductoEntity = await productoRepository.save({
      nombre: faker.lorem.words(), 
      descripcion: faker.lorem.words()

    })

    await expect(()=> service.findProductoByCulturaIdProductoId(culturagastronomica.id, newProducto.id)).rejects.toHaveProperty("message", "El producto con el id proporcionado no esta asociado a la cultura gastronomica"); 
  });

  it('findProductoByCulturaId debe retornar los productos de una cultura gastronomica', async ()=>{
    const productos: ProductoEntity[] = await service.findProductosByCulturaId(culturagastronomica.id);
    expect(productos.length).toBe(5)
  });

  it('findProductoByCulturaId debe arrojar una excepcion para una cultura gastronomica invalida', async () => {
    await expect(()=> service.findProductosByCulturaId("0")).rejects.toHaveProperty("message", "La cultura gastronomica con el id proporcionado no ha sido encontrada"); 
  });

  it('associateProductoCultura debe actualizar la lista de productos de una cultura gastronomica', async () => {
    const newProducto: ProductoEntity = await productoRepository.save({
      nombre: faker.lorem.words(), 
      descripcion: faker.lorem.words()

    })

    const updatedCulturaGastronomica: CulturaGastronomicaEntity = await service.associateProductoCultura(culturagastronomica.id, [newProducto]);
    expect(updatedCulturaGastronomica.productos.length).toBe(1);

    expect(updatedCulturaGastronomica.productos[0].nombre).toBe(newProducto.nombre);
    expect(updatedCulturaGastronomica.productos[0].descripcion).toBe(newProducto.descripcion);

  });

  it('associateProductoCultura debe arrojar una excepcion para una cultura gastronomica invalida', async () => {
    const newProducto: ProductoEntity = await productoRepository.save({
      nombre: faker.lorem.words(), 
      descripcion: faker.lorem.words()

    })

    await expect(()=> service.associateProductoCultura("0", [newProducto])).rejects.toHaveProperty("message", "La cultura gastronomica con el id proporcionado no ha sido encontrada"); 
  });

  it('associateProductoCultura debe arrojar una excepcion para un producto invalido', async () => {
    const newProducto: ProductoEntity = productosList[0];
    newProducto.id = "0";

    await expect(()=> service.associateProductoCultura(culturagastronomica.id, [newProducto])).rejects.toHaveProperty("message", "El producto con el id proporcionado no ha sido encontrado"); 
  });

  it('deleteProductoToCultura debe eliminar un producto de una cultura gastronomica', async () => {
    const producto: ProductoEntity = productosList[0];
    
    await service.deleteProductoToCultura(culturagastronomica.id, producto.id);

    const storedCulturaGastronomica: CulturaGastronomicaEntity = await culturaRepository.findOne({where: {id: culturagastronomica.id}, relations: ["productos"]});
    const deletedProducto: ProductoEntity = storedCulturaGastronomica.productos.find(a => a.id === producto.id);

    expect(deletedProducto).toBeUndefined();

  });

  it('deleteProductoToCultura debe arrojar una excepcion para un producto invalido', async () => {
    await expect(()=> service.deleteProductoToCultura(culturagastronomica.id, "0")).rejects.toHaveProperty("message", "El producto con el id proporcionado no ha sido encontrado"); 
  });

  it('deleteProductoToCultura debe arrojar una excepcion para una cultura gastronomica invalida', async () => {
    const producto: ProductoEntity = productosList[0];
    await expect(()=> service.deleteProductoToCultura("0", producto.id)).rejects.toHaveProperty("message", "La cultura gastronomica con el id proporcionado no ha sido encontrada"); 
  });

  it('deleteProductoToCultura debe arrojar una excepcion para un restaurante no asociado a una cultura gastronomica', async () => {
    const newProducto: ProductoEntity = await productoRepository.save({
      nombre: faker.lorem.words(), 
      descripcion: faker.lorem.words()

    })

    await expect(()=> service.deleteProductoToCultura(culturagastronomica.id, newProducto.id)).rejects.toHaveProperty("message", "El producto con el id proporcionado no esta asociado a la cultura gastronomica"); 
  }); 

});
