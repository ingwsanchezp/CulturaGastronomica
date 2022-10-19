import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CulturaGastronomicaEntity } from '../culturagastronomica/culturagastronomica.entity';
import { Repository } from 'typeorm';
import { RecetaEntity } from '../receta/receta.entity';
import { BusinessLogicException, BusinessError } from '../shared/errors/business-errors';

@Injectable()
export class CulturaRecetaService {
    constructor(
        @InjectRepository(CulturaGastronomicaEntity)
        private readonly culturaGastronomicaRepository: Repository<CulturaGastronomicaEntity>,

        @InjectRepository(RecetaEntity)
        private readonly recetaRepository: Repository<RecetaEntity>
    ) {}

    async addRecetaToCultura(culturaId: string, recetaId: string): Promise<CulturaGastronomicaEntity> {
        const receta: RecetaEntity = await this.recetaRepository.findOne({where: {id: recetaId}});
        if (!receta)
            throw new BusinessLogicException("La receta con el id proporcionado no ha sido encontrada", BusinessError.NOT_FOUND);
        
        const culturagastronomica: CulturaGastronomicaEntity = await this.culturaGastronomicaRepository.findOne({where: {id: culturaId}, relations: ["region", "recetas", "paises"]});
        if (!culturagastronomica)
            throw new BusinessLogicException("La cultura gastronomica con el id proporcionado no ha sido encontrada", BusinessError.NOT_FOUND);
         
        culturagastronomica.recetas = [...culturagastronomica.recetas, receta];
        return this.culturaGastronomicaRepository.save(culturagastronomica)
   

    }

    async findCulturaFromReceta(recetaId: string): Promise<CulturaGastronomicaEntity> {
        const receta: RecetaEntity = await this.recetaRepository.findOne({where: {id: recetaId}})
        if (!receta)
            throw new BusinessLogicException("La receta con el id proporcionado no ha sido encontrada", BusinessError.NOT_FOUND);
        
        return receta.culturagastronomica;    
   
    }   

    async findRecetaFromCultura(culturaId: string, recetaId: string){
        const receta: RecetaEntity = await this.recetaRepository.findOne({where: {id: recetaId}});
        if (!receta)
            throw new BusinessLogicException("La receta con el id proporcionado no ha sido encontrada", BusinessError.NOT_FOUND);
        
        const culturagastronomica: CulturaGastronomicaEntity = await this.culturaGastronomicaRepository.findOne({where: {id: culturaId}, relations: ["recetas"]});
        if (!culturagastronomica)
            throw new BusinessLogicException("La cultura gastronomica con el id proporcionado no ha sido encontrada", BusinessError.NOT_FOUND);
        
        const culturaReceta: RecetaEntity = culturagastronomica.recetas.find(e => e.id === receta.id)

        if(!culturaReceta)
            throw new BusinessLogicException("La receta con el id proporcionado no esta asociada a la cultura gastronomica", BusinessError.PRECONDITION_FAILED)
        
        return culturaReceta;
    }
    
    async findRecetasFromCultura(culturaId: string): Promise<RecetaEntity[]> {
        const culturagastronomica: CulturaGastronomicaEntity = await this.culturaGastronomicaRepository.findOne({where: {id: culturaId}, relations: ["recetas"]});
        if (!culturagastronomica)
            throw new BusinessLogicException("La cultura gastronomica con el id proporcionado no ha sido encontrada", BusinessError.NOT_FOUND);
        return culturagastronomica.recetas;
    }

    async associateRecetaCultura(culturaId: string, recetaToAdd: RecetaEntity): Promise<CulturaGastronomicaEntity> {
        const culturagastronomica: CulturaGastronomicaEntity = await this.culturaGastronomicaRepository.findOne({where: {id: culturaId}, relations: ["recetas"]});
        
        if (!culturagastronomica)
            throw new BusinessLogicException("La cultura gastronomica con el id proporcionado no ha sido encontrada", BusinessError.NOT_FOUND);
        
        const recetas: RecetaEntity[] = culturagastronomica.recetas    
        for (let i = 0; i <  recetas.length; i++) {
            const receta: RecetaEntity = await this.recetaRepository.findOne({where: {id: recetaToAdd.id}})
            if (!receta)
                throw new BusinessLogicException("La receta con el id proporcionado no ha sido encontrada", BusinessError.NOT_FOUND);
        }
        
        culturagastronomica.recetas.push(recetaToAdd);
        return this.culturaGastronomicaRepository.save(culturagastronomica);    
    }

    async deleteRecetaToCultura(culturaId: string, recetaId: string) {
        const receta: RecetaEntity = await this.recetaRepository.findOne({where: {id: recetaId}})
        if (!receta)
            throw new BusinessLogicException("La receta con el id proporcionado no ha sido encontrada", BusinessError.NOT_FOUND);
        
        const culturagastronomica: CulturaGastronomicaEntity = await this.culturaGastronomicaRepository.findOne({where: {id: culturaId}, relations: ["recetas"]});
        if (!culturagastronomica)
            throw new BusinessLogicException("La cultura gastronomica con el id proporcionado no ha sido encontrada", BusinessError.NOT_FOUND);
        
        const culturaReceta: RecetaEntity = culturagastronomica.recetas.find(e => e.id === receta.id)

        if(!culturaReceta)
            throw new BusinessLogicException("La receta con el id proporcionado no esta asociada a la cultura gastronomica", BusinessError.PRECONDITION_FAILED)
        
        culturagastronomica.recetas = culturagastronomica.recetas.filter(e => e.id !== recetaId )
        await this.culturaGastronomicaRepository.save(culturagastronomica)    
    }
}
