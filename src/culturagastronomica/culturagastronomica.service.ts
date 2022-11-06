import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { CulturaGastronomicaEntity } from './culturagastronomica.entity';

@Injectable()
export class CulturagastronomicaService {
    cacheKey: string = "cultura"
    constructor(
        @InjectRepository(CulturaGastronomicaEntity)
        private readonly culturaRepository: Repository<CulturaGastronomicaEntity>,

        @Inject(CACHE_MANAGER)
        private readonly cacheManager: Cache
      ){}

    

    async findAll(): Promise<CulturaGastronomicaEntity[]>{
        const cached: CulturaGastronomicaEntity[] = await this.cacheManager.get<CulturaGastronomicaEntity[]>(this.cacheKey);
        if (!cached){
            const culturas: CulturaGastronomicaEntity[] = await this.culturaRepository.find({ relations: {region: true,},});
            await this.cacheManager.set(this.cacheKey, culturas);
            return culturas;
        }
        return cached;
    }

    async finOne(id: string): Promise<CulturaGastronomicaEntity>{
        const cultura: CulturaGastronomicaEntity = await this.culturaRepository.findOne({where: {id}, relations: {region: true,},});
        if (!cultura)
            throw new BusinessLogicException("La cultura gastronomica con el id no a sido encontrada", BusinessError.NOT_FOUND);

        return cultura;
    }

    async create(cultura: CulturaGastronomicaEntity): Promise<CulturaGastronomicaEntity>{
        return await this.culturaRepository.save(cultura);
    }

    async update(id: string, cultura: CulturaGastronomicaEntity): Promise<CulturaGastronomicaEntity>{
        const persistedCultura: CulturaGastronomicaEntity = await this.culturaRepository.findOne({where:{id}});
        if (!persistedCultura)
            throw new BusinessLogicException("La cultura gastronomica con el id no a sido encontrada", BusinessError.NOT_FOUND);
        return await this.culturaRepository.save({...persistedCultura, ...cultura});
    }

    async delete(id: string){
        const cultura: CulturaGastronomicaEntity = await this.culturaRepository.findOne({where:{id}});
        if (!cultura)
            throw new BusinessLogicException("La cultura gastronomica con el id no a sido encontrada", BusinessError.NOT_FOUND);
        await this.culturaRepository.remove(cultura);
    }

    async deleteAll(){
        await this.culturaRepository.clear();
    }

    async count(): Promise<number>{
        return await this.culturaRepository.count();
    }
}
