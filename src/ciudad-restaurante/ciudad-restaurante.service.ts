import { Param, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CiudadEntity } from '../ciudad/ciudad.entity';
import { RestauranteEntity } from '../restaurante/restaurante.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class CiudadRestauranteService {
    constructor(
        @InjectRepository(CiudadEntity)
        private readonly ciudadRepository: Repository<CiudadEntity>,
        @InjectRepository(RestauranteEntity)
        private readonly restauranteRepository: Repository<RestauranteEntity>
    ){}
    
    async addCiudadRestaurante(restauranteId: string, ciudadId: string): Promise<CiudadEntity> {
        const restaurante: RestauranteEntity = await this.restauranteRepository.findOne({where: {id: restauranteId}, relations: ["ciudad"]})
        if (!restaurante)
          throw new BusinessLogicException("El Restaurante con el id proporcionado no ha sido encontrado", BusinessError.NOT_FOUND);

        const ciudad: CiudadEntity = await this.ciudadRepository.findOne({where: {id: ciudadId},relations: ["restaurantes"]});
          if (!ciudad)
            throw new BusinessLogicException("La Ciudad con el id proporcionado no ha sido encontrado", BusinessError.NOT_FOUND);
      
        ciudad.restaurantes = [...ciudad.restaurantes, restaurante];
        return await this.ciudadRepository.save(ciudad);
    }
  
    async findRestaranteByCiudadIdRestauranteId(restauranteId: string, ciudadId: string): Promise<RestauranteEntity> {
        const ciudad: CiudadEntity = await this.ciudadRepository.findOne({where: {id: ciudadId},relations: ["restaurantes"]});
        if (!ciudad)
          throw new BusinessLogicException("La Ciudad con el id proporcionado no ha sido encontrada", BusinessError.NOT_FOUND);
      
        const restaurante: RestauranteEntity = await this.restauranteRepository.findOne({where: {id: restauranteId}, relations: ["ciudad"]})
        if (!restaurante)
          throw new BusinessLogicException("El Restaurante con el id proporcionado no ha sido encontrado", BusinessError.NOT_FOUND);
          
        const ciudadRestaurante: RestauranteEntity = ciudad.restaurantes.find(e => e.id === restauranteId)
        if(!ciudadRestaurante)
            throw new BusinessLogicException("le Restaurante con el id proporcionado no esta asociado la cuidad", BusinessError.PRECONDITION_FAILED)
        
        return ciudadRestaurante;    
   
    }  

    async findRestarantesByCiudadId(@Param('ciudadId') ciudadId: string): Promise<RestauranteEntity[]> {
        const ciudad: CiudadEntity = await this.ciudadRepository.findOne({where: {id: ciudadId}, relations: ["restaurantes"]});
        if (!ciudad)
            throw new BusinessLogicException("La Ciudad con el id proporcionado no ha sido encontrada", BusinessError.NOT_FOUND);
        return ciudad.restaurantes;
    }
    
    async associateRestauranteCiudad(ciudadId: string, restaurantes: RestauranteEntity[]): Promise<CiudadEntity> {
        const ciudad: CiudadEntity = await this.ciudadRepository.findOne({where: {id: ciudadId}, relations: ["restaurantes"]});
        
        if (!ciudad) {
            throw new BusinessLogicException("La Ciudad con el id proporcionado no ha sido encontrado", BusinessError.NOT_FOUND);
        }
        for (const element of restaurantes) {
            const restaurante: RestauranteEntity = await this.restauranteRepository.findOne({where: {id: element.id}})
            if (!restaurante) {
                throw new BusinessLogicException("El Restaurante con el id proporcionado no ha sido encontrado", BusinessError.NOT_FOUND);
            }
        }
        
        ciudad.restaurantes = restaurantes;
        return this.ciudadRepository.save(ciudad);    
    }

    async deleteRestauranteToCiudad(ciudadId: string, restauranteId: string) {
        const restaurante: RestauranteEntity = await this.restauranteRepository.findOne({where: {id: restauranteId}})
        if (!restaurante)
            throw new BusinessLogicException("El Restaurante con el id proporcionado no ha sido encontrado", BusinessError.NOT_FOUND);
        
        const ciudad: CiudadEntity = await this.ciudadRepository.findOne({where: {id: ciudadId}, relations: ["restaurantes"]});
        if (!ciudad)
            throw new BusinessLogicException("La Ciudad con el id proporcionado no ha sido encontrada", BusinessError.NOT_FOUND);
        
        const ciudadRestaurante: RestauranteEntity = ciudad.restaurantes.find(e => e.id === restaurante.id)

        if(!ciudadRestaurante)
            throw new BusinessLogicException("El Restaurante con el id proporcionado no esta asociado a la ciudad ", BusinessError.PRECONDITION_FAILED)
        
        ciudad.restaurantes = ciudad.restaurantes.filter(e => e.id !== restauranteId )
        await this.ciudadRepository.save(ciudad)    
    } 

}
