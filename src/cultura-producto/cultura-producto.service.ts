import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CulturaGastronomicaEntity } from '../culturagastronomica/culturagastronomica.entity';
import { Repository } from 'typeorm';
import { ProductoEntity } from '../producto/producto.entity';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class CulturaProductoService {

    constructor(
        @InjectRepository(CulturaGastronomicaEntity)
        private readonly culturaGastronomicaRepository: Repository<CulturaGastronomicaEntity>,
        @InjectRepository(ProductoEntity)
        private readonly productoRepository: Repository<ProductoEntity>
    ){}

    async addProductoCultura(culturaId: string, productoId: string): Promise<CulturaGastronomicaEntity> {
        const producto: ProductoEntity = await this.productoRepository.findOne({where: {id:productoId}});
        if(!producto)
            throw new BusinessLogicException("El producto con el id proporcionado no ha sido encontrado", BusinessError.NOT_FOUND);
        
        const culturagastronomica: CulturaGastronomicaEntity = await this.culturaGastronomicaRepository.findOne({where: {id: culturaId}, relations: ["region", "recetas", "paises", "restaurantes", "productos"]});
        if (!culturagastronomica)
            throw new BusinessLogicException("La cultura gastronomica con el id proporcionado no ha sido encontrada", BusinessError.NOT_FOUND);
            
        culturagastronomica.productos = [...culturagastronomica.productos, producto];
        return this.culturaGastronomicaRepository.save(culturagastronomica)
       

    }

    async findProductoByCulturaIdProductoId(culturaId: string, productoId: string): Promise<ProductoEntity> {
        const producto: ProductoEntity = await this.productoRepository.findOne({where: {id: productoId}})
        if (!producto)
            throw new BusinessLogicException("El producto con el id proporcionado no ha sido encontrado", BusinessError.NOT_FOUND);
        
        const culturagastronomica: CulturaGastronomicaEntity = await this.culturaGastronomicaRepository.findOne({where: {id: culturaId}, relations: ["productos"]});
        if (!culturagastronomica)
            throw new BusinessLogicException("La cultura gastronomica con el id proporcionado no ha sido encontrada", BusinessError.NOT_FOUND);
        
        const culturaProducto: ProductoEntity = culturagastronomica.productos.find(e => e.id === producto.id)

        if(!culturaProducto)
            throw new BusinessLogicException("El producto con el id proporcionado no esta asociado a la cultura gastronomica", BusinessError.PRECONDITION_FAILED)
        
        return culturaProducto;    
   
    }  
           
    async findProductosByCulturaId(culturaId: string): Promise<ProductoEntity[]> {
        const culturagastronomica: CulturaGastronomicaEntity = await this.culturaGastronomicaRepository.findOne({where: {id: culturaId}, relations: ["productos"]});
        if (!culturagastronomica)
            throw new BusinessLogicException("La cultura gastronomica con el id proporcionado no ha sido encontrada", BusinessError.NOT_FOUND);
        return culturagastronomica.productos;
    }

    async associateProductoCultura(culturaId: string, productos: ProductoEntity[]): Promise<CulturaGastronomicaEntity> {
        const culturagastronomica: CulturaGastronomicaEntity = await this.culturaGastronomicaRepository.findOne({where: {id: culturaId}, relations: ["productos"]});
        
        if (!culturagastronomica)
            throw new BusinessLogicException("La cultura gastronomica con el id proporcionado no ha sido encontrada", BusinessError.NOT_FOUND);
        
        for (const element of productos) {
            const producto: ProductoEntity = await this.productoRepository.findOne({where: {id: element.id}})
            if (!producto)
                throw new BusinessLogicException("El producto con el id proporcionado no ha sido encontrado", BusinessError.NOT_FOUND);
        }
        
        culturagastronomica.productos = productos;
        return this.culturaGastronomicaRepository.save(culturagastronomica);    
    }

    async deleteProductoToCultura(culturaId: string, productoId: string) {
        const producto: ProductoEntity = await this.productoRepository.findOne({where: {id: productoId}})
        if (!producto)
            throw new BusinessLogicException("El producto con el id proporcionado no ha sido encontrado", BusinessError.NOT_FOUND);
        
        const culturagastronomica: CulturaGastronomicaEntity = await this.culturaGastronomicaRepository.findOne({where: {id: culturaId}, relations: ["productos"]});
        if (!culturagastronomica)
            throw new BusinessLogicException("La cultura gastronomica con el id proporcionado no ha sido encontrada", BusinessError.NOT_FOUND);
        
        const culturaProducto: ProductoEntity = culturagastronomica.productos.find(e => e.id === producto.id)

        if(!culturaProducto)
            throw new BusinessLogicException("El producto con el id proporcionado no esta asociado a la cultura gastronomica", BusinessError.PRECONDITION_FAILED)
        
        culturagastronomica.productos = culturagastronomica.productos.filter(e => e.id !== productoId )
        await this.culturaGastronomicaRepository.save(culturagastronomica)    
    }

}
