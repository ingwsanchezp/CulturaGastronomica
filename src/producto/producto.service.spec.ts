import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { ProductoEntity } from './producto.entity';
import { ProductoService } from './producto.service';
import { faker } from '@faker-js/faker';
import { CulturaGastronomicaEntity } from '../culturagastronomica/culturagastronomica.entity';
import { RegionEntity } from '../region/region.entity';

describe('ProductoService', () => {
  let service: ProductoService;
  let repository: Repository<ProductoEntity>;
  let productosList: ProductoEntity[]
  let culturaGastronomicaData = new CulturaGastronomicaEntity();
  let regionData = new RegionEntity();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ProductoService],
    }).compile();

    service = module.get<ProductoService>(ProductoService);
    repository = module.get<Repository<ProductoEntity>>(getRepositoryToken(ProductoEntity));
    await seedDatabase();  
  });

  const seedDatabase = async () => {
      repository.clear();
      productosList = [];
     
      for(let i = 0; i < 5; i++){
            const producto: ProductoEntity = await repository.save({
                    nombre: faker.company.name(),
                    descripcion: faker.commerce.productDescription(),
                     })
                    productosList.push(producto);
         }

         culturaGastronomicaData.nombre = faker.company.name();
         culturaGastronomicaData.descripcion = faker.commerce.productDescription();
         culturaGastronomicaData.region= regionData;
         culturaGastronomicaData.recetas= [];
         culturaGastronomicaData.paises= [];
         culturaGastronomicaData.productos = productosList;
   }


  it('el servicio debe estar definido', () => {
    expect(service).toBeDefined();
  });

  it('findAll deberia retornar todos los productos', async () => {
     const productos: ProductoEntity[] = await service.findAll();
     expect(productos).not.toBeNull();
     expect(productos).toHaveLength(productosList.length);
   });
  
  it('findOne deberia retornar un producto por id', async () => {
     const storedProducto: ProductoEntity = productosList[0];
     const producto: ProductoEntity = await service.findOne(storedProducto.id);
     expect(producto).not.toBeNull();
     expect(producto.nombre).toEqual(storedProducto.nombre)
     expect(producto.descripcion).toEqual(storedProducto.descripcion)
     expect(producto.culturaGastronomica).toEqual(storedProducto.culturaGastronomica)
     expect(producto.categoriaProducto).toEqual(storedProducto.categoriaProducto)
  });

  it('findOne deberia retornar una excepción por producto invalido', async () => {
     await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "El producto no existe")
  });

  it('Crear un producto nuevo', async () => {

      const producto: ProductoEntity = await repository.save({
          nombre: faker.company.name(),
          descripcion: faker.commerce.productDescription()
       })
       const newProducto: ProductoEntity = await service.create(producto);
       expect(newProducto).not.toBeNull();

       const storedProducto:ProductoEntity = await service.findOne(newProducto.id);
       expect(storedProducto).not.toBeNull;
       expect(storedProducto.nombre).toEqual(newProducto.nombre)
       expect(storedProducto.descripcion).toEqual(newProducto.descripcion)
  });

   it('Actualizar o modificar un producto', async ()=> {
     const producto: ProductoEntity = productosList[0];
     producto.nombre = "Nuevo nombre";
     producto.descripcion = "Nueva descripcion";
     const updatedProducto: ProductoEntity = await service.update(producto.id, producto);
     expect(updatedProducto).not.toBeNull();
     const storedProducto: ProductoEntity = await repository.findOne({ where: { id: producto.id } })
     expect(storedProducto).not.toBeNull();
     expect(storedProducto.nombre).toEqual(storedProducto.nombre)
     expect(storedProducto.descripcion).toEqual(storedProducto.descripcion)
  });

  it('Actualización invalida dado a un producto invalido', async () => {
     let producto: ProductoEntity = productosList[0];
     producto = {
       ...producto, nombre: "Nuevo nombre", descripcion: "Nueva descripcion"
     }
     await expect(() => service.update("0", producto)).rejects.toHaveProperty("message", "El producto no existe")
   });

   it('Eliminar un producto', async () => {
    const producto: ProductoEntity = productosList[0];
    await service.delete(producto.id);
    const deletedProducto: ProductoEntity = await repository.findOne({ where: { id: producto.id } })
    expect(deletedProducto).toBeNull();
   });

   it('Eliminación fallida por un producto invalido', async () => {
    const producto: ProductoEntity = productosList[0];
    await service.delete(producto.id);
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "El producto no existe")
   });

});
