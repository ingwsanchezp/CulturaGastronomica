import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CulturaGastronomicaEntity } from '../culturagastronomica/culturagastronomica.entity';
import { RestauranteEntity } from '../restaurante/restaurante.entity';
import { CulturaRestauranteService } from './cultura-restaurante.service';

@Resolver()
export class CulturaRestauranteResolver {
    constructor(private culturaRestauranteService: CulturaRestauranteService){}

    @Query(() => RestauranteEntity)
    findRestaurantesByCulturaId(@Args('id') id: string): Promise<RestauranteEntity[]>{
        return this.culturaRestauranteService.findRestaurantesByCulturaId(id);
    }

    @Query(() => RestauranteEntity)
    findRestauranteByCulturaIdRestauranteId(@Args('culturaId') culturaId: string, @Args('restauranteId') restauranteId:string ):Promise<RestauranteEntity>{
        return this.culturaRestauranteService.findRestauranteByCulturaIdRestauranteId(culturaId,restauranteId);
    }

    @Mutation(() => CulturaGastronomicaEntity)
    addRestauranteCultura(@Args('culturaId') culturaId: string, @Args('restauranteId') restauranteId:string ):Promise<CulturaGastronomicaEntity>{
        return this.culturaRestauranteService.addRestauranteCultura(culturaId,restauranteId);
    }

    @Mutation(() => String)
    deleteRestauranteToCultura(@Args('culturaId') culturaId: string, @Args('restauranteId') restauranteId:string){
        return this.culturaRestauranteService.deleteRestauranteToCultura(culturaId, restauranteId);
    }

}
