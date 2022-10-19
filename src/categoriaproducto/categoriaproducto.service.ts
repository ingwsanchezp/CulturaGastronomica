
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoriaproductoEntity } from './categoriaproducto.entity';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';


@Injectable()
export class CategoriaproductoService {

    constructor(
        @InjectRepository(CategoriaproductoEntity)
        private readonly categoriaRepository: Repository<CategoriaproductoEntity>
    ){}


    async findAll(): Promise<CategoriaproductoEntity[]>{
        return await this.categoriaRepository.find({ relations: {productos: true,},});
    }

    async findOne(id: string): Promise<CategoriaproductoEntity>{
        const categoria: CategoriaproductoEntity = await this.categoriaRepository.findOne({where: {id}, relations: {productos: true,},});
        if (!categoria)
            throw new BusinessLogicException("La categoria con el id no a sido encontrada", BusinessError.NOT_FOUND);

        return categoria;
    }

    async create(categoria: CategoriaproductoEntity): Promise<CategoriaproductoEntity>{
        return await this.categoriaRepository.save(categoria);
    }

    async update(id: string, categoria: CategoriaproductoEntity): Promise<CategoriaproductoEntity>{
        const persistedcategoria: CategoriaproductoEntity = await this.categoriaRepository.findOne({where:{id}});
        if (!persistedcategoria)
            throw new BusinessLogicException("La categoria con el id no a sido encontrada", BusinessError.NOT_FOUND);
        return await this.categoriaRepository.save({...persistedcategoria, ...categoria});
    }

    async delete(id: string){
        const categoria: CategoriaproductoEntity = await this.categoriaRepository.findOne({where:{id}});
        if (!categoria)
            throw new BusinessLogicException("La categoria con el id no a sido encontrada", BusinessError.NOT_FOUND);
        await this.categoriaRepository.remove(categoria);
    }
}
