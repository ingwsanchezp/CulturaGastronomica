import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { RecetaService } from './receta.service';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { RecetaDto } from './receta.dto';
import { RecetaEntity } from './receta.entity';
import { plainToInstance } from 'class-transformer';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { HasRoles } from '../usuario/roles.decorator';
import { Role } from '../usuario/role.enum';
import { RolesGuard } from '../auth/guards/roles.guard';

@Controller('recetas')
@UseInterceptors(BusinessErrorsInterceptor)
export class RecetaController {
    constructor(private readonly recetaService: RecetaService){}

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get()
    @HasRoles(Role.Lector, Role.Admin, Role.LectorReceta)
    async findAll() {
        return await this.recetaService.findAll();
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get(':recetaId')
    @HasRoles(Role.Lector, Role.Admin, Role.LectorReceta)
    async findOne(@Param('recetaId') recetaId: string){
        return await this.recetaService.findOne(recetaId);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Post()
    @HasRoles(Role.Editor, Role.Admin, Role.EditorReceta)
    async create(@Body() recetaDto: RecetaDto){
        const receta: RecetaEntity = plainToInstance(RecetaEntity, recetaDto);
        return await this.recetaService.create(receta);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Put(':recetaId')
    @HasRoles(Role.Editor, Role.Admin, Role.EditorReceta)
    async update(@Param('recetaId') recetaId: string,  @Body() recetaDto: RecetaDto) {
        const receta: RecetaEntity = plainToInstance(RecetaEntity, recetaDto);
        return await this.recetaService.update(recetaId, receta);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Delete(':recetaId')
    @HasRoles(Role.Borrar, Role.Admin, Role.BorrarReceta)
    @HttpCode(204)
    async delete(@Param('recetaId') recetaId: string){
        return await this.recetaService.delete(recetaId)
    }
    

}
