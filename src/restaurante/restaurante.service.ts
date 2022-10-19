import { Injectable } from '@nestjs/common';
import { RestauranteEntity } from './restaurante.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class RestauranteService {
    constructor(
        @InjectRepository(RestauranteEntity)
       private readonly restauranteRepository: Repository<RestauranteEntity>
    ){}
    /*
    TRAER TODOS LOS RESTAURANTES
    */
    async findAll(): Promise<RestauranteEntity[]> {
        return this.restauranteRepository.find();
    }

     /*
    TRAER UN RESTAURANTE POR ID
    */
    async findOne(id: string): Promise<RestauranteEntity> {
        const restaurante: RestauranteEntity = await this.restauranteRepository.findOne({where: {id} } );
        if (!restaurante)
          throw new BusinessLogicException("El restaurante con el id proporcionado no ha sido encontrado.", BusinessError.NOT_FOUND);
        return restaurante;
    }

    /*
    TRAER Obtener un restaurante con cultura gastronómica en especifico
    */
    async findRestauranteByCultura(id:string): Promise<RestauranteEntity>{
        const restaurante: RestauranteEntity = await this.restauranteRepository.findOne({where: {id}, relations: ["culturaGastronomica"] } );
        if (!restaurante)
          throw new BusinessLogicException("El restaurante con el id proporcionado no ha sido encontrado.", BusinessError.NOT_FOUND);
        return restaurante; 
    }

     /*
    CREACION RESTAURANTE
    */
    async create(restaurante: RestauranteEntity): Promise<RestauranteEntity> {
        return this.restauranteRepository.save(restaurante);
    }
    /*
    ACTUALIZACION RESTAURANTE
    */
    async update(id: string, restaurante: RestauranteEntity): Promise<RestauranteEntity> {
        const persistedRestaurante: RestauranteEntity = await this.restauranteRepository.findOne({where:{id}});
        if (!persistedRestaurante)
          throw new BusinessLogicException("El restaurante con el id proporcionado no ha sido encontrado.", BusinessError.NOT_FOUND);
        restaurante.id =id;  
        return this.restauranteRepository.save(restaurante);
    }
    /*
    ELIMINAR PRODUCTO
    */
   async delete(id: string) {
        const restaurante: RestauranteEntity = await this.restauranteRepository.findOne({where:{id}});
        if (!restaurante)
            throw new BusinessLogicException("El restaurante con el id proporcionado no ha sido encontrado.", BusinessError.NOT_FOUND);
        await this.restauranteRepository.remove(restaurante);
    }

}
