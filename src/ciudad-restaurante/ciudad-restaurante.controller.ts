import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseGuards } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { RestauranteDto } from '../restaurante/restaurante.dto';
import { RestauranteEntity } from '../restaurante/restaurante.entity';
import { CiudadEntity } from 'src/ciudad/ciudad.entity';
import { CiudadRestauranteService } from './ciudad-restaurante.service';

@Controller('ciudad-restaurante')
export class CiudadRestauranteController {
    constructor(private readonly ciudadRestauranteService: CiudadRestauranteService){}

    // @UseGuards(JwtAuthGuard, RolesGuard)
    @Get(':ciudadId/restaurantes/:restauranteId')
    //@HasRoles(Role.Editor, Role.Admin, Role.LectorCultura)
    async findRestaranteByCiudadIdRestauranteId(@Param('ciudadId') ciudadId: string, @Param('restauranteId') restauranteId: string): Promise<RestauranteEntity>{
       return this.ciudadRestauranteService.findRestaranteByCiudadIdRestauranteId(restauranteId, ciudadId);
    }
    
    // @UseGuards(JwtAuthGuard, RolesGuard)
    @Get(':ciudadId/restaurantes')
    // @HasRoles(Role.Editor, Role.Admin, Role.LectorCultura)
    async findRestarantesByCiudadId(@Param('ciudadId') ciudadId: string): Promise<RestauranteEntity[]>{
       return this.ciudadRestauranteService.findRestarantesByCiudadId(ciudadId);
    }

    //@UseGuards(JwtAuthGuard, RolesGuard)
    @Post(':ciudadId/restaurantes/:restauranteId')
    //@HasRoles(Role.Editor, Role.Admin, Role.EditorCultura)
    async addCiudadRestaurante(@Param('ciudadId') ciudadId: string, @Param('restauranteId') restauranteId: string){
       return this.ciudadRestauranteService.addCiudadRestaurante(restauranteId, ciudadId);
    }
    //@UseGuards(JwtAuthGuard, RolesGuard)
    @Put(':ciudadId/restaurantes')
    //@HasRoles(Role.Editor, Role.Admin, Role.EditorCultura)
    async associateRestauranteCiudad(@Body() restaurantesDto: RestauranteDto[], @Param('ciudadId') ciudadId: string): Promise<CiudadEntity>{
       const restaurantes = plainToInstance(RestauranteEntity, restaurantesDto)
       return this.ciudadRestauranteService.associateRestauranteCiudad(ciudadId, restaurantes);
    }

    //@UseGuards(JwtAuthGuard, RolesGuard)
    @Delete(':ciudadId/restaurantes/:restauranteId')
    //@HasRoles(Role.Borrar, Role.Admin, Role.BorrarCultura)
    @HttpCode(204)
    async deleteRestauranteToCiudad(@Param('ciudadId') ciudadId: string, @Param('restauranteId') restauranteId: string): Promise<void>{
       return this.ciudadRestauranteService.deleteRestauranteToCiudad(ciudadId, restauranteId);
    }

}
