import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CulturaGastronomicaEntity } from '../culturagastronomica/culturagastronomica.entity';
import { ProductoEntity } from '../producto/producto.entity';
import { CulturaProductoService } from './cultura-producto.service';

@Resolver()
export class CulturaProductoResolver {
    constructor(private culturaProductoService: CulturaProductoService){}

    @Query(() => ProductoEntity)
    findProductosByCulturaId(@Args('id') id: string): Promise<ProductoEntity[]>{
        return this.culturaProductoService.findProductosByCulturaId(id);
    }

    @Query(() => ProductoEntity)
    findProductoByCulturaIdProductoId(@Args('culturaId') culturaId: string, @Args('productoId') productoId:string ):Promise<ProductoEntity>{
        return this.culturaProductoService.findProductoByCulturaIdProductoId(culturaId,productoId);
    }

    @Mutation(() => CulturaGastronomicaEntity)
    addProductoCultura(@Args('culturaId') culturaId: string, @Args('productoId') productoId:string ):Promise<CulturaGastronomicaEntity>{
        return this.culturaProductoService.addProductoCultura(culturaId,productoId);
    }

    @Mutation(() => String)
    deleteProductoToCultura(@Args('culturaId') culturaId: string, @Args('productoId') productoId:string){
        return this.culturaProductoService.deleteProductoToCultura(culturaId, productoId);
    }




}
