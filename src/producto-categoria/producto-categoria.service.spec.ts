import { Test, TestingModule } from '@nestjs/testing';
import { ProductoCategoriaService } from './producto-categoria.service';
import { faker } from '@faker-js/faker';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CategoriaproductoEntity } from '../categoriaproducto/categoriaproducto.entity';
import { ProductoEntity } from '../producto/producto.entity';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { RestauranteEntity } from '../restaurante/restaurante.entity';
import { PaisEntity } from '../pais/pais.entity';
import { RecetaEntity } from '../receta/receta.entity';
import { RegionEntity } from '../region/region.entity'


describe('ProductoCategoriaService', () => {
  let service: ProductoCategoriaService;
  let categoriaProductoRepository: Repository<CategoriaproductoEntity>;
  let productoRepository: Repository<ProductoEntity>;
  let productosList = [];
  let restaurantesList: RestauranteEntity[];
  let categoriaproducto: CategoriaproductoEntity;
  let paisesList: PaisEntity[];
  let recetasList: RecetaEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ProductoCategoriaService],
    }).compile();

    service = module.get<ProductoCategoriaService>(ProductoCategoriaService);
    categoriaProductoRepository = module.get<Repository<CategoriaproductoEntity>>(getRepositoryToken(CategoriaproductoEntity));
    productoRepository = module.get<Repository<ProductoEntity>>(getRepositoryToken(ProductoEntity));
    await seeDatabase();
    
  });
  
  const seeDatabase = async () => {
    categoriaProductoRepository.clear();
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
      
      categoriaproducto = await categoriaProductoRepository.save({
        nombre: faker.company.name(),
        productos: productosList
      })
    }
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  
  it('addProductoCategoria agregar un Producto a una CategoriaProducto', async () => {
    const newProducto: ProductoEntity = await productoRepository.save({
      nombre: faker.lorem.words(), 
      descripcion: faker.lorem.words()
    })
    const newProductoCategoria: CategoriaproductoEntity = await categoriaProductoRepository.save({
        nombre: faker.company.name(),
        //descripcion: faker.commerce.productDescription(),
    })
    
    const resultado: CategoriaproductoEntity = await service.addProductoCategoria(newProductoCategoria.id, newProducto.id);
    expect(resultado.productos.length).toBe(1);
    expect(resultado.productos[0]).not.toBeNull();
    expect(resultado.productos[0].nombre).toBe(newProducto.nombre);
    
  });


  it('addProductoCategoria debe producir una excepcion para un producto invalido', async () => {
    const newProductoCategoria: CategoriaproductoEntity = await categoriaProductoRepository.save({
      nombre: faker.company.name(),
      descripcion: faker.commerce.productDescription(),
    })
  
    await expect(() => service.addProductoCategoria(newProductoCategoria.id, "0")).rejects.toHaveProperty("message", "El producto con el id proporcionado no ha sido encontrado");
  });

  it('addProductoCategoria debe producir una excepcion para una categoria invalida', async () => {
    const newProducto: ProductoEntity = await productoRepository.save({
      nombre: faker.lorem.words(), 
      descripcion: faker.lorem.words()

    })

    await expect (() => service.addProductoCategoria("0", newProducto.id)).rejects.toHaveProperty("message", "La categoria con el id proporcionado no ha sido encontrada");
  
  });

  it('findProductoByCategoriaIdProductoId debe retornar un producto de una categoria', async () => {
    const producto: ProductoEntity = productosList[0];
    const storedProducto: ProductoEntity = await service.findProductoByCategoriaIdProductoId(categoriaproducto.id, producto.id, )
    expect(storedProducto).not.toBeNull();
    expect(storedProducto.nombre).toBe(producto.nombre);
    //expect(storedProducto.descripcion).toBe(producto.descripcion);
  });

  it('findProductoByCategoriaIdProductoId debe arrojar una excepcion para un producto invalido', async () => {
    await expect(()=> service.findProductoByCategoriaIdProductoId(categoriaproducto.id, "0")).rejects.toHaveProperty("message", "El producto con el id proporcionado no ha sido encontrado"); 
  });

  it('findProductoByCategoriaIdProductoId debe arrojar una excepcion para una categoria invalida', async () => {
    const producto: ProductoEntity = productosList[0];
    await expect(()=> service.findProductoByCategoriaIdProductoId("0", producto.id)).rejects.toHaveProperty("message", "La categoria con el id proporcionado no ha sido encontrada"); 
  });

  it('findProductoByCategoriaIdProductoId debe arrojar una excepcion para un producto no asociado a una categoria', async () => {
    const newProducto: ProductoEntity = await productoRepository.save({
      nombre: faker.lorem.words(), 
      descripcion: faker.lorem.words()

    })

    await expect(()=> service.findProductoByCategoriaIdProductoId(categoriaproducto.id, newProducto.id)).rejects.toHaveProperty("message", "El producto con el id proporcionado no esta asociado a la categoria");    
  });

  it('findProductosByCategoriaId debe retornar los productos de una categoria', async ()=>{
    const productos: ProductoEntity[] = await service.findProductosByCategoriaId(categoriaproducto.id);
    expect(productos.length).toBe(5)
  });

  it('findProductosByCategoriaId debe arrojar una excepcion para una categoria invalida', async () => {
    await expect(()=> service.findProductosByCategoriaId("0")).rejects.toHaveProperty("message", "La categoria con el id proporcionado no ha sido encontrada"); 
  });


  it('associateProductoCategoria debe actualizar la lista de productos de una categoria', async () => {
    const newProducto: ProductoEntity = await productoRepository.save({
      nombre: faker.lorem.words(), 
      descripcion: faker.lorem.words()

    })

    const updatedCategoria: CategoriaproductoEntity = await service.associateProductoCategoria(categoriaproducto.id, [newProducto]);
    expect(updatedCategoria.productos.length).toBe(1);

    expect(updatedCategoria.productos[0].nombre).toBe(newProducto.nombre);
    expect(updatedCategoria.productos[0].descripcion).toBe(newProducto.descripcion);

  });

  it('associateProductoCategoria debe arrojar una excepcion para una categoria invalida', async () => {
    const newProducto: ProductoEntity = await productoRepository.save({
      nombre: faker.lorem.words(), 
      descripcion: faker.lorem.words()

    })

    await expect(()=> service.associateProductoCategoria("0", [newProducto])).rejects.toHaveProperty("message", "La categoria con el id proporcionado no ha sido encontrada"); 
  });
  
  it('associateProductoCategoria debe arrojar una excepcion para un producto invalido', async () => {
    const newProducto: ProductoEntity = productosList[0];
    newProducto.id = "0";

    await expect(()=> service.associateProductoCategoria(categoriaproducto.id, [newProducto])).rejects.toHaveProperty("message", "El producto con el id proporcionado no ha sido encontrado"); 
  });

  it('deleteProductoToCategoria debe eliminar un producto de una categoria', async () => {
    const producto: ProductoEntity = productosList[0];
    
    await service.deleteProductoToCategoria(categoriaproducto.id, producto.id);

    const storedCulturaGastronomica: CategoriaproductoEntity = await categoriaProductoRepository.findOne({where: {id: categoriaproducto.id}, relations: ["productos"]});
    const deletedProducto: ProductoEntity = storedCulturaGastronomica.productos.find(a => a.id === producto.id);

    expect(deletedProducto).toBeUndefined();

  });


  it('deleteProductoToCategoria debe arrojar una excepcion para un producto no asociado a una categoria', async () => {
    const newProducto: ProductoEntity = await productoRepository.save({
      nombre: faker.lorem.words(), 
      descripcion: faker.lorem.words()

    })

    await expect(()=> service.deleteProductoToCategoria(categoriaproducto.id, newProducto.id)).rejects.toHaveProperty("message", "El producto con el id proporcionado no esta asociado a la categoria"); 
  }); 

});
