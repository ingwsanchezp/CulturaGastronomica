import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { RegionDto } from '../region/region.dto';
import { RegionEntity } from '../region/region.entity';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { CulturaRegionService } from './cultura-region.service';
import { plainToInstance } from 'class-transformer';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Role } from 'src/usuario/role.enum';
import { HasRoles } from 'src/usuario/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@Controller('culturasgastronomicas')
@UseInterceptors(BusinessErrorsInterceptor)
export class CulturaRegionController {
    constructor(private readonly culturaRegionService: CulturaRegionService){}
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Post(':culturaId/regiones/:regionId')
    @HasRoles(Role.Editor, Role.Admin, Role.EditorCultura)
    async addCulturaRegion(@Param('culturaId') culturaId: string, @Param('regionId') regionId: string){
      return await this.culturaRegionService.addCulturaRegion(culturaId, regionId);  
    }
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get(':culturaId/regiones')
    @HasRoles(Role.Lector, Role.Admin, Role.LectorCultura)
    async findRegionPorCulturaId(@Param('culturaId') culturaId: string){
        return await this.culturaRegionService.findRegionPorCulturaId(culturaId)
    }
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get('/regiones/:regionId')
    @HasRoles(Role.Lector, Role.Admin, Role.LectorCultura)
    async findCulturaPorRegionId(@Param('regionId') regionId: string){
        return await this.culturaRegionService.findCulturaPorRegionId(regionId)
    }
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Put(':culturaId/regiones')
    @HasRoles(Role.Editor, Role.Admin, Role.EditorCultura)
    async asociarRegionCulturaId(@Param('culturaId') culturaId: string, @Body() regionDto: RegionDto){
        const region: RegionEntity = plainToInstance(RegionEntity, regionDto)
        return await this.culturaRegionService.associateRegionaCulturaId(culturaId, region);
    }
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Delete(':culturaId/regiones/:regionId')
    @HasRoles(Role.Borrar, Role.Admin, Role.BorrarCultura)
    @HttpCode(204)
    async deleteRegionCultura(@Param('culturaId') culturaId: string, @Param('regionId') regionId: string){
        return await this.culturaRegionService.deleteRegionIdCulturaId(culturaId, regionId);
    }
 
}
