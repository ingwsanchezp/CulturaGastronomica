import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { PaisDto } from 'src/pais/pais.dto';
import { PaisEntity } from 'src/pais/pais.entity';
import { Role } from 'src/usuario/role.enum';
import { HasRoles } from 'src/usuario/roles.decorator';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { PaisCulturaService } from './pais-cultura.service';

@Controller('culturasgastronomicas')
@UseInterceptors(BusinessErrorsInterceptor)
export class PaisCulturaController {
    constructor(private readonly paisCulturaService: PaisCulturaService){}

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Post(":culturaId/paises/:paisId")
    @HasRoles(Role.Editor, Role.Admin, Role.EditorPais, Role.EditorCultura)
    async addPaisToCultura(@Param('culturaId') culturaId: string, @Param('paisId') paisId: string){
        return this.paisCulturaService.addPaisToCultura(culturaId, paisId)
    }
        
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get(':culturaId/paises')
    @HasRoles(Role.Lector, Role.Admin, Role.LectorPais, Role.LectorCultura)
    async findPaisesFromCultura(@Param('culturaId') culturaId: string){
        return this.paisCulturaService.findPaisesFromCultura(culturaId);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get(':culturaId/paises/:paisId')
    @HasRoles(Role.Lector, Role.Admin, Role.LectorPais, Role.LectorCultura)
    async findPaisFromCultura(@Param('culturaId') culturaId: string, @Param('paisId') paisId: string){
        return this.paisCulturaService.findPaisFromCultura(culturaId, paisId);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Put(':culturaId/paises')
    @HasRoles(Role.Editor, Role.Admin, Role.EditorPais, Role.EditorCultura)
    async associateRecetaToCultura(@Param('culturaId') culturaId: string, @Body() paisDto: PaisDto){
        const pais: PaisEntity = plainToInstance(PaisEntity, paisDto);
        return this.paisCulturaService.updateCulturasPais(culturaId, pais);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Delete(':culturaId/paises/:paisId')
    @HasRoles(Role.Borrar, Role.Admin, Role.BorrarPais)
    @HttpCode(204)
    async deleteRecetaFromCultura(@Param('culturaId') culturaId: string, @Param('paisId') paisId: string){
        return await this.paisCulturaService.deletePaisFromCultura(culturaId, paisId);
    }



}
