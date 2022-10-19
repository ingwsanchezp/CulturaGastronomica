import { Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { CategoriaproductoEntity } from '../categoriaproducto/categoriaproducto.entity';
import { ProductoEntity } from '../producto/producto.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class ProductoCategoriaService {
    constructor(
        @InjectRepository(CategoriaproductoEntity)
        private readonly categoiaproductoRepository: Repository<CategoriaproductoEntity>,
        @InjectRepository(ProductoEntity)
        private readonly productoRepository: Repository<ProductoEntity>
    ){}

    async addProductoCategoria(categoriaId: string, productoId: string): Promise<CategoriaproductoEntity> {
        const producto: ProductoEntity = await this.productoRepository.findOne({where: {id:productoId}});
        if(!producto)
            throw new BusinessLogicException("El producto con el id proporcionado no ha sido encontrado", BusinessError.NOT_FOUND);
        
        const categoriaproducto: CategoriaproductoEntity = await this.categoiaproductoRepository.findOne({where: {id: categoriaId}, relations: ["productos"]});
        if (!categoriaproducto)
            throw new BusinessLogicException("La categoria con el id proporcionado no ha sido encontrada", BusinessError.NOT_FOUND);
            
        categoriaproducto.productos = [...categoriaproducto.productos, producto];
        return this.categoiaproductoRepository.save(categoriaproducto)       
    }

    async findProductoByCategoriaIdProductoId(categoriaId: string, productoId: string): Promise<ProductoEntity> {
        const producto: ProductoEntity = await this.productoRepository.findOne({where: {id: productoId}})
        if (!producto)
            throw new BusinessLogicException("El producto con el id proporcionado no ha sido encontrado", BusinessError.NOT_FOUND);
        
        const categoriaproducto: CategoriaproductoEntity = await this.categoiaproductoRepository.findOne({where: {id: categoriaId}, relations: ["productos"]});
        if (!categoriaproducto)
            throw new BusinessLogicException("La categoria con el id proporcionado no ha sido encontrada", BusinessError.NOT_FOUND);
        
        const productoCategoria: ProductoEntity = categoriaproducto.productos.find(e => e.id === producto.id)
        if(!productoCategoria)
            throw new BusinessLogicException("El producto con el id proporcionado no esta asociado a la categoria", BusinessError.PRECONDITION_FAILED)
        
        return productoCategoria;    
   
    }  

    async findProductosByCategoriaId(categoriaId: string): Promise<ProductoEntity[]> {
        const categoriaproducto: CategoriaproductoEntity = await this.categoiaproductoRepository.findOne({where: {id: categoriaId}, relations: ["productos"]});
        if (!categoriaproducto)
            throw new BusinessLogicException("La categoria con el id proporcionado no ha sido encontrada", BusinessError.NOT_FOUND);
        return categoriaproducto.productos;
    }

    async associateProductoCategoria(categoriaId: string, productos: ProductoEntity[]): Promise<CategoriaproductoEntity> {
        const categoriaproducto: CategoriaproductoEntity = await this.categoiaproductoRepository.findOne({where: {id: categoriaId}, relations: ["productos"]});
        
        if (!categoriaproducto)
            throw new BusinessLogicException("La categoria con el id proporcionado no ha sido encontrada", BusinessError.NOT_FOUND);
        
        for (const element of productos) {
            const producto: ProductoEntity = await this.productoRepository.findOne({where: {id: element.id}})
            if (!producto)
                throw new BusinessLogicException("El producto con el id proporcionado no ha sido encontrado", BusinessError.NOT_FOUND);
        }
        
        categoriaproducto.productos = productos;
        return this.categoiaproductoRepository.save(categoriaproducto);    
    }

    async deleteProductoToCategoria(categoriaId: string, productoId: string) {
        const producto: ProductoEntity = await this.productoRepository.findOne({where: {id: productoId}})
        if (!producto)
            throw new BusinessLogicException("El producto con el id proporcionado no ha sido encontrado", BusinessError.NOT_FOUND);
        
        const categoriaproducto: CategoriaproductoEntity = await this.categoiaproductoRepository.findOne({where: {id: categoriaId}, relations: ["productos"]});
        if (!categoriaproducto)
            throw new BusinessLogicException("La categoria con el id proporcionado no ha sido encontrada", BusinessError.NOT_FOUND);
        
        const productoCategoria: ProductoEntity = categoriaproducto.productos.find(e => e.id === producto.id)
        if(!productoCategoria)
            throw new BusinessLogicException("El producto con el id proporcionado no esta asociado a la categoria", BusinessError.PRECONDITION_FAILED)
        
        categoriaproducto.productos = categoriaproducto.productos.filter(e => e.id !== productoId )
        await this.categoiaproductoRepository.save(categoriaproducto)    
    }

}