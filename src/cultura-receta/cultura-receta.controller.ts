import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { RecetaDto } from 'src/receta/receta.dto';
import { RecetaEntity } from '../receta/receta.entity';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { CulturaRecetaService } from './cultura-receta.service';
import { plainToInstance } from 'class-transformer';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Role } from 'src/usuario/role.enum';
import { HasRoles } from 'src/usuario/roles.decorator';


@Controller('culturasgastronomicas')
@UseInterceptors(BusinessErrorsInterceptor)
export class CulturaRecetaController {
    constructor(private readonly culturaRecetaService: CulturaRecetaService){}

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get(':culturaId/recetas')
    @HasRoles(Role.Lector, Role.Admin, Role.LectorReceta)
    async findRecetasFromCultura(@Param('culturaId') culturaId: string){
        return await this.culturaRecetaService.findRecetasFromCultura(culturaId);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get(':culturaId/recetas/:recetaId')
    @HasRoles(Role.Lector, Role.Admin, Role.LectorReceta)
    async findRecetaFromCultura(@Param('culturaId') culturaId: string, @Param('recetaId') recetaId: string){
        return await this.culturaRecetaService.findRecetaFromCultura(culturaId, recetaId);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get(':recetaId/cultura')
    @HasRoles(Role.Lector, Role.Admin, Role.LectorReceta)
    async findCulturaFromReceta(@Param('recetaId') recetaId: string){
        return await this.culturaRecetaService.findCulturaFromReceta(recetaId);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Post(':culturaId/recetas/:recetaId')
    @HasRoles(Role.Lector, Role.Admin, Role.EditorReceta)
    async addRecetaToCultura(@Param('culturaId') culturaId: string, @Param('recetaId') recetaId: string){
        return await this.culturaRecetaService.addRecetaToCultura(culturaId, recetaId);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Put(':culturaId/recetas')
    @HasRoles(Role.Editor, Role.Admin, Role.EditorReceta)
    async associateRecetaToCultura(@Param('culturaId') culturaId: string, @Body() recetaDto: RecetaDto){
        const receta: RecetaEntity = plainToInstance(RecetaEntity, recetaDto);
        return await this.culturaRecetaService.associateRecetaCultura(culturaId, receta);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Delete(':culturaId/recetas/:recetaId')
    @HttpCode(204)
    @HasRoles(Role.Borrar, Role.Admin, Role.BorrarReceta)
    async deleteRecetaFromCultura(@Param('culturaId') culturaId: string, @Param('recetaId') recetaId: string){
        return await this.culturaRecetaService.deleteRecetaToCultura(culturaId, recetaId);
    }


}
