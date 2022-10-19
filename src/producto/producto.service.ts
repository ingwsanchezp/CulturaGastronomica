import { Injectable } from '@nestjs/common';
import { ProductoEntity } from './producto.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { CulturaGastronomicaEntity } from '../culturagastronomica/culturagastronomica.entity';
import { CategoriaproductoEntity } from '../categoriaproducto/categoriaproducto.entity';

@Injectable()
export class ProductoService {
    constructor(
        @InjectRepository(ProductoEntity)
       private readonly productoRepository: Repository<ProductoEntity>
    ){}
    /*
    TRAER TODOS LOS PRODUCTOS
    */
    async findAll(): Promise<ProductoEntity[]> {
        return await this.productoRepository.find();
    }
    /*
    TRAER UN PRODUCTO POR ID
    */
    async findOne(id: string): Promise<ProductoEntity> {
        const producto: ProductoEntity = await this.productoRepository.findOne({where: {id} } );
        if (!producto)
          throw new BusinessLogicException("El producto no existe", BusinessError.NOT_FOUND);
        return producto;
    }
    /*
    TRAER CATEGORIAS ASOCIDAS POR PRODUCTO
    */
    async findCategoriasbyProducto(id:string): Promise<CategoriaproductoEntity>{
        const producto: ProductoEntity = await this.productoRepository.findOne({where: {id}, relations: ["categoria"] } );
        if (!producto)
          throw new BusinessLogicException("El producto no existe", BusinessError.NOT_FOUND);
        return producto.categoriaProducto; 
    }
    /*
    TRAER CULTURAS GASTRONOMICAS ASOCIDAS POR PRODUCTO
    */
    async findCulturasbyProducto(id:string): Promise<CulturaGastronomicaEntity>{
        const producto: ProductoEntity = await this.productoRepository.findOne({where: {id}, relations: ["culturaGastronomica"] } );
        if (!producto)
          throw new BusinessLogicException("El producto no existe", BusinessError.NOT_FOUND);
        return producto.culturaGastronomica; 
    }
    /*
    CREACION PRODUCTO
    */
    async create(producto: ProductoEntity): Promise<ProductoEntity> {
        return await this.productoRepository.save(producto);
    }
    /*
    ACTUALIZACION PRODUCTO
    */
    async update(id: string, producto: ProductoEntity): Promise<ProductoEntity> {
        const persistedProducto: ProductoEntity = await this.productoRepository.findOne({where:{id}});
        if (!persistedProducto)
          throw new BusinessLogicException("El producto no existe", BusinessError.NOT_FOUND);
        
        producto.id =id;  
        return await this.productoRepository.save(producto);
    }
    /*
    ELIMINAR PRODUCTO
    */
   async delete(id: string) {
        const producto: ProductoEntity = await this.productoRepository.findOne({where:{id}});
        if (!producto) {
          throw new BusinessLogicException("El producto no existe", BusinessError.NOT_FOUND);
        }
        await this.productoRepository.remove(producto);
    }
}
