import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CulturaGastronomicaEntity } from '../culturagastronomica/culturagastronomica.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { PaisEntity } from '../pais/pais.entity';

@Injectable()
export class PaisCulturaService {
    constructor(
        @InjectRepository(PaisEntity)
        private readonly paisRepository: Repository<PaisEntity>,

        @InjectRepository(CulturaGastronomicaEntity)
        private readonly culturaGastronomicaRepository: Repository<CulturaGastronomicaEntity>
    ){}

    async addPaisToCultura(culturaId: string, paisId: string): Promise<CulturaGastronomicaEntity> {
        const pais = await this.paisRepository.findOne({where: {id: paisId}});
        if (!pais)
            throw new BusinessLogicException("El pais con el id proporcionado no ha sido encontrado", BusinessError.NOT_FOUND)
        
        const culturagastronomica = await this.culturaGastronomicaRepository.findOne({where:{id: culturaId}, relations: ["region", "recetas", "paises"]});
        if (!culturagastronomica)
            throw new BusinessLogicException("La cultura gastronomica con el id proporcionado no ha sido encontrada", BusinessError.NOT_FOUND);
        
        culturagastronomica.paises = [...culturagastronomica.paises, pais];
        return await this.culturaGastronomicaRepository.save(culturagastronomica);
    }

    async findCulturasFromPais(paisId: string): Promise<CulturaGastronomicaEntity[]> {
        const pais = await this.paisRepository.findOne({where: {id: paisId}, relations:["culturasgastronomicas"] });
        if (!pais)
            throw new BusinessLogicException("El pais con el id proporcionado no ha sido encontrado", BusinessError.NOT_FOUND)
        
        return pais.culturasgastronomicas;
    }

    async findPaisesFromCultura(culturaId: string): Promise<PaisEntity[]>{
        const culturagastronomica = await this.culturaGastronomicaRepository.findOne({where:{id: culturaId}, relations: ["paises"]});
        if (!culturagastronomica)
            throw new BusinessLogicException("La cultura gastronomica con el id proporcionado no ha sido encontrada", BusinessError.NOT_FOUND);

        return culturagastronomica.paises;

    }

    async findPaisFromCultura(culturaId: string, paisId: string) {
        const pais: PaisEntity = await this.paisRepository.findOne({where: {id: paisId} });
        if (!pais)
            throw new BusinessLogicException("El pais con el id proporcionado no ha sido encontrado", BusinessError.NOT_FOUND)
        
        const culturagastronomica = await this.culturaGastronomicaRepository.findOne({where:{id: culturaId}, relations: ["paises"]});
        if (!culturagastronomica)
            throw new BusinessLogicException("La cultura gastronomica con el id proporcionado no ha sido encontrada", BusinessError.NOT_FOUND);

        const culturaPais = culturagastronomica.paises.find(e => e.id === pais.id);

        if (!culturaPais)
            throw new BusinessLogicException("El pais con el id proporcionado no esta asociado a la cultura gastronomica", BusinessError.PRECONDITION_FAILED)
        
        return culturaPais;     
    }



    async updateCulturasPais(culturaId: string, paisToAdd: PaisEntity): Promise<CulturaGastronomicaEntity> {
        const culturagastronomica = await this.culturaGastronomicaRepository.findOne({where:{id: culturaId}, relations: ["paises"]});
        if (!culturagastronomica)
            throw new BusinessLogicException("La cultura gastronomica con el id proporcionado no ha sido encontrada", BusinessError.NOT_FOUND);

        
        const paises: PaisEntity[] = culturagastronomica.paises;
        for (let i = 0; i < paises.length; i++){
            const pais: PaisEntity = await this.paisRepository.findOne({where: {id: paisToAdd.id}})
            if (!pais) {
                throw new BusinessLogicException("El pais con el id proporcionado no ha sido encontrado", BusinessError.NOT_FOUND);
            }
        }

        culturagastronomica.paises.push(paisToAdd);
        return this.culturaGastronomicaRepository.save(culturagastronomica);
    }
    

    async deletePaisFromCultura(culturaId: string, paisId: string) {
        const pais:PaisEntity = await this.paisRepository.findOne({where: {id: paisId}});
        if (!pais)
            throw new BusinessLogicException("El pais con el id proporcionado no ha sido encontrado", BusinessError.NOT_FOUND);
        
        const culturagastronomica = await this.culturaGastronomicaRepository.findOne({where:{id: culturaId}, relations:["paises"]});
        if (!culturagastronomica)
            throw new BusinessLogicException("La cultura gastronomica con el id proporcionado no ha sido encontrada", BusinessError.NOT_FOUND);
        
        const culturaPais: PaisEntity = culturagastronomica.paises.find(e => e.id === paisId)
        if (!culturaPais) {
            throw new BusinessLogicException("El pais con el id proporcionado no esta asociado a la cultura gastronomica", BusinessError.PRECONDITION_FAILED)
        }
        culturagastronomica.paises = culturagastronomica.paises.filter(e => e.id !== paisId)
        await this.culturaGastronomicaRepository.save(culturagastronomica);
    }

    





}
