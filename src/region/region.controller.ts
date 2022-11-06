import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { BusinessLogicException, BusinessError } from 'src/shared/errors/business-errors';
import { Role } from 'src/usuario/role.enum';
import { HasRoles } from 'src/usuario/roles.decorator';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { RegionDto } from './region.dto';
import { RegionEntity } from './region.entity';
import { RegionService } from './region.service';

@Controller('regiones')
@UseInterceptors(BusinessErrorsInterceptor)
export class RegionController {
    constructor(private readonly regionService: RegionService){}
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get()
    @HasRoles(Role.Lector, Role.Admin, Role.LectorRegion)
    async findAll(){
        return await this.regionService.findAll();
    }
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get(':regionId')
    @HasRoles(Role.Lector, Role.Admin, Role.LectorRegion)
    async findOne(@Param('regionId') regionId: string){
        return await this.regionService.findOne(regionId);
    }
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Post()
    @HasRoles(Role.Editor, Role.Admin, Role.EditorRegion)
    async create(@Body() regionDto: RegionDto){
        if(parseInt(regionDto.id) === NaN){
            throw new BusinessLogicException("La region no puede ser creada", BusinessError.BAD_REQUEST);
        }
        const region: RegionEntity = plainToInstance(RegionEntity, regionDto);
        return await this.regionService.create(region);
    }
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Put(':regionId')
    @HasRoles(Role.Editor, Role.Admin, Role.EditorRegion)
    async update(@Param('regionId') regionId: string, @Body() regionDto: RegionDto){
        const region: RegionEntity = plainToInstance(RegionEntity, regionDto);
        return await this.regionService.update(regionId, region);
    }
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Delete(':regionId')
    @HasRoles(Role.Borrar, Role.Admin, Role.BorrarRegion)
    @HttpCode(204)
    async delete(@Param('regionId') regionId: string){
        return await this.regionService.delete(regionId)
    }


    
}

