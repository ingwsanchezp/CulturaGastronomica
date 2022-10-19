import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { RestauranteDto } from '../restaurante/restaurante.dto';
import { RestauranteEntity } from '../restaurante/restaurante.entity';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { CulturaRestauranteService } from './cultura-restaurante.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Role } from '../usuario/role.enum';
import { HasRoles } from '../usuario/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CulturaGastronomicaEntity } from '../culturagastronomica/culturagastronomica.entity';
@Controller('cultura-restaurante')
@UseInterceptors(BusinessErrorsInterceptor)
export class CulturaRestauranteController {
    constructor(private readonly culturaRestauranteService: CulturaRestauranteService){}
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get(':culturaId/restaurantes/:restauranteId')
    @HasRoles(Role.Editor, Role.Admin, Role.LectorCultura)
    async findRestauranteByCulturaIdAProductoId(@Param('culturaId') culturaId: string, @Param('restauranteId') restauranteId: string): Promise<RestauranteEntity>{
       return this.culturaRestauranteService.findRestauranteByCulturaIdRestauranteId(culturaId, restauranteId);
    }
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get(':culturaId/restaurantes')
    @HasRoles(Role.Editor, Role.Admin, Role.LectorCultura)
    async findRestaurantesFromCultura(@Param('culturaId') culturaId: string): Promise<RestauranteEntity[]>{
       return this.culturaRestauranteService.findRestaurantesByCulturaId(culturaId);
    }
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Post(':culturaId/restaurantes/:restauranteId')
    @HasRoles(Role.Editor, Role.Admin, Role.EditorCultura)
    async addRestaurantetoCultura(@Param('culturaId') culturaId: string, @Param('restauranteId') restauranteId: string){
       return this.culturaRestauranteService.addRestauranteCultura(culturaId, restauranteId);
    }
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Put(':culturaId/restaurantes')
    @HasRoles(Role.Editor, Role.Admin, Role.EditorCultura)
    async associateProductosCultura(@Body() restaurantesDto: RestauranteDto[], @Param('culturaId') culturaId: string): Promise<CulturaGastronomicaEntity>{
       const restaurantes = plainToInstance(RestauranteEntity, restaurantesDto)
       return this.culturaRestauranteService.associateRestauranteCultura(culturaId, restaurantes);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Delete(':culturaId/restaurantes/:restauranteId')
    @HasRoles(Role.Borrar, Role.Admin, Role.BorrarCultura)
    @HttpCode(204)
    async deleteProductosCultura(@Param('culturaId') culturaId: string, @Param('restauranteId') restauranteId: string): Promise<void>{
       return this.culturaRestauranteService.deleteRestauranteToCultura(culturaId, restauranteId);
    }
}
