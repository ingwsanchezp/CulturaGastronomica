import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { PaisEntity } from './pais.entity';
import { PaisDto } from './pais.dto';
import { Cache } from 'cache-manager';

@Injectable()
export class PaisService {
    cacheKey: string = "paises";

    constructor(
        @InjectRepository(PaisEntity)
        private readonly paisRepository: Repository<PaisEntity>,
        @Inject(CACHE_MANAGER)
        private readonly cacheManager: Cache
      ){}

    async findAll(): Promise<PaisEntity[]>{
        const cached: PaisEntity[] = await this.cacheManager.get<PaisEntity[]>(this.cacheKey)
        if(!cached){
            const paises: PaisEntity[] = await this.paisRepository.find({ relations: {culturasgastronomicas: true,},});
            await this.cacheManager.set(this.cacheKey, paises);
            return paises;
        }
        return cached;
    }

    async findOne(id: string): Promise<PaisEntity>{
        const pais: PaisEntity = await this.paisRepository.findOne({where: {id}});
        if (!pais)
            throw new BusinessLogicException("El pais con el id proporcionado no ha sido encontrado", BusinessError.NOT_FOUND);

        return pais;
    }

    async create(pais: PaisDto): Promise<PaisDto>{
        return await this.paisRepository.save(pais);
    }

    async update(id: string, pais: PaisEntity): Promise<PaisEntity>{
        const persistedPais: PaisEntity = await this.paisRepository.findOne({where:{id}});
        if (!persistedPais)
            throw new BusinessLogicException("El pais con el id proporcionado no ha sido encontrado", BusinessError.NOT_FOUND);
        return await this.paisRepository.save({...persistedPais, ...pais});
    }

    async delete(id: string){
        const pais: PaisEntity = await this.paisRepository.findOne({where:{id}});
        if (!pais)
            throw new BusinessLogicException("El pais con el id proporcionado no ha sido encontrado", BusinessError.NOT_FOUND);
        await this.paisRepository.remove(pais);
    }
}
