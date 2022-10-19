import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CulturaGastronomicaEntity } from '../culturagastronomica/culturagastronomica.entity';
import { Repository } from 'typeorm';
import { RestauranteEntity } from '../restaurante/restaurante.entity';
import { BusinessLogicException, BusinessError } from '../shared/errors/business-errors';

@Injectable()
export class CulturaRestauranteService {
    constructor(
        @InjectRepository(CulturaGastronomicaEntity)
        private readonly culturaGastronomicaRepository: Repository<CulturaGastronomicaEntity>,

        @InjectRepository(RestauranteEntity)
        private readonly restauranteRepository: Repository<RestauranteEntity>
    ) {}

    async addRestauranteCultura(culturaId: string, restauranteId: string): Promise<CulturaGastronomicaEntity> {
        const restaurante: RestauranteEntity = await this.restauranteRepository.findOne({where: {id: restauranteId}});
        if (!restaurante)
            throw new BusinessLogicException("El restaurante con el id proporcionado no ha sido encontrado", BusinessError.NOT_FOUND);
        
        const culturagastronomica: CulturaGastronomicaEntity = await this.culturaGastronomicaRepository.findOne({where: {id: culturaId}, relations: ["region", "recetas", "paises", "restaurantes"]});
        if (!culturagastronomica)
            throw new BusinessLogicException("La cultura gastronomica con el id proporcionado no ha sido encontrada", BusinessError.NOT_FOUND);
         
        culturagastronomica.restaurantes = [...culturagastronomica.restaurantes, restaurante];
        return await this.culturaGastronomicaRepository.save(culturagastronomica)
   
    }

    async findRestauranteByCulturaIdRestauranteId(culturaId: string, restauranteId: string): Promise<RestauranteEntity> {
        const restaurante: RestauranteEntity = await this.restauranteRepository.findOne({where: {id: restauranteId}})
        if (!restaurante)
            throw new BusinessLogicException("El restaurante con el id proporcionado no ha sido encontrado", BusinessError.NOT_FOUND);
        
        const culturagastronomica: CulturaGastronomicaEntity = await this.culturaGastronomicaRepository.findOne({where: {id: culturaId}, relations: ["restaurantes"]});
        if (!culturagastronomica)
            throw new BusinessLogicException("La cultura gastronomica con el id proporcionado no ha sido encontrada", BusinessError.NOT_FOUND);
        
        const culturaRestaurante: RestauranteEntity = culturagastronomica.restaurantes.find(e => e.id === restaurante.id)

        if(!culturaRestaurante)
            throw new BusinessLogicException("El restaurante con el id proporcionado no esta asociado a la cultura gastronomica", BusinessError.PRECONDITION_FAILED)
        
        return culturaRestaurante;    
   
    }  
           
    async findRestaurantesByCulturaId(culturaId: string): Promise<RestauranteEntity[]> {
        const culturagastronomica: CulturaGastronomicaEntity = await this.culturaGastronomicaRepository.findOne({where: {id: culturaId}, relations: ["restaurantes"]});
        if (!culturagastronomica)
            throw new BusinessLogicException("La cultura gastronomica con el id proporcionado no ha sido encontrada", BusinessError.NOT_FOUND);
        return culturagastronomica.restaurantes;
    }

    async associateRestauranteCultura(culturaId: string, restaurantes: RestauranteEntity[]): Promise<CulturaGastronomicaEntity> {
        const culturagastronomica: CulturaGastronomicaEntity = await this.culturaGastronomicaRepository.findOne({where: {id: culturaId}, relations: ["restaurantes"]});
        
        if (!culturagastronomica)
            throw new BusinessLogicException("La cultura gastronomica con el id proporcionado no ha sido encontrada", BusinessError.NOT_FOUND);
        
        for (let i = 0; i <  restaurantes.length; i++) {
            const restaurante: RestauranteEntity = await this.restauranteRepository.findOne({where: {id: restaurantes[i].id}})
            if (!restaurante)
                throw new BusinessLogicException("El restaurante con el id proporcionado no ha sido encontrado", BusinessError.NOT_FOUND);
        }
        
        culturagastronomica.restaurantes = restaurantes;
        return this.culturaGastronomicaRepository.save(culturagastronomica);    
    }

    async deleteRestauranteToCultura(culturaId: string, restauranteId: string) {
        const restaurante: RestauranteEntity = await this.restauranteRepository.findOne({where: {id: restauranteId}})
        if (!restaurante)
            throw new BusinessLogicException("El restaurante con el id proporcionado no ha sido encontrado", BusinessError.NOT_FOUND);
        
        const culturagastronomica: CulturaGastronomicaEntity = await this.culturaGastronomicaRepository.findOne({where: {id: culturaId}, relations: ["restaurantes"]});
        if (!culturagastronomica)
            throw new BusinessLogicException("La cultura gastronomica con el id proporcionado no ha sido encontrada", BusinessError.NOT_FOUND);
        
        const culturaRestaurante: RestauranteEntity = culturagastronomica.restaurantes.find(e => e.id === restaurante.id)

        if(!culturaRestaurante)
            throw new BusinessLogicException("El restaurante con el id proporcionado no esta asociado a la cultura gastronomica", BusinessError.PRECONDITION_FAILED)
        
        culturagastronomica.restaurantes = culturagastronomica.restaurantes.filter(e => e.id !== restauranteId )
        await this.culturaGastronomicaRepository.save(culturagastronomica)    
    }
}
