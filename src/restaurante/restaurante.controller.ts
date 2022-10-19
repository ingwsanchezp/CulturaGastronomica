import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role } from '../usuario/role.enum';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { RestauranteDto } from './restaurante.dto';
import { RestauranteEntity } from './restaurante.entity';
import { RestauranteService } from './restaurante.service';
import { HasRoles } from '../usuario/roles.decorator';

@Controller('restaurante')
@UseInterceptors(BusinessErrorsInterceptor)
export class RestauranteController {
    constructor(private readonly restauranteService: RestauranteService) {}
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get()
    @HasRoles(Role.Lector, Role.Admin, Role.LectorRestaurante)
    async findAll(): Promise<RestauranteEntity[]> {
      return this.restauranteService.findAll();
    }
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get(':restauranteId')
    @HasRoles(Role.Lector, Role.Admin, Role.LectorRestaurante)
    async findOne(@Param('restauranteId') restauranteId: string): Promise<RestauranteEntity> {
        return this.restauranteService.findOne(restauranteId);
    }
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Post()
    @HasRoles(Role.Editor, Role.Admin, Role.EditorRestaurante)
    @Post()
    async create(@Body() restauranteDto: RestauranteDto): Promise<RestauranteEntity> {
        const restaurante: RestauranteEntity = plainToInstance(RestauranteEntity, restauranteDto);
        return this.restauranteService.create(restaurante);
    }
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Put(':restauranteId')
    @HasRoles(Role.Editor, Role.Admin, Role.EditorRestaurante)
    async update(@Param('restauranteId') restauranteId: string, @Body() restauranteDto: RestauranteDto): Promise<RestauranteEntity> {
        const restaurante: RestauranteEntity = plainToInstance(RestauranteEntity, restauranteDto);
        return this.restauranteService.update(restauranteId, restaurante);
    }
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Delete(':restauranteId')
    @HasRoles(Role.Borrar, Role.Admin, Role.BorrarRestaurante)
    @HttpCode(204)
    async delete(@Param('restauranteId') restauranteId: string): Promise<void> {
        return this.restauranteService.delete(restauranteId);
    }

}
