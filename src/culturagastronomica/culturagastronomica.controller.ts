import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { BusinessLogicException, BusinessError } from 'src/shared/errors/business-errors';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors.interceptor';
import { Role } from 'src/usuario/role.enum';
import { HasRoles } from 'src/usuario/roles.decorator';
import { CulturagastronomicaDto } from './culturagastronomica.dto';
import { CulturaGastronomicaEntity } from './culturagastronomica.entity';
import { CulturagastronomicaService } from './culturagastronomica.service';

@Controller('culturasgastronomicas')
@UseInterceptors(BusinessErrorsInterceptor)
export class CulturagastronomicaController {
    constructor(private readonly culturaService: CulturagastronomicaService){}
    @UseGuards(JwtAuthGuard)
    @Get()
    @HasRoles(Role.Lector, Role.Admin, Role.LectorCultura)
    async findAll(){
        return await this.culturaService.findAll();
    }
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get(':culturaId')
    @HasRoles(Role.Lector, Role.Admin, Role.LectorCultura)
    async findOne(@Param('culturaId') culturaId: string){
        return await this.culturaService.finOne(culturaId);
    }
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Post()
    @HasRoles(Role.Editor, Role.Admin, Role.EditorCultura)
    async create(@Body() culturaDto: CulturagastronomicaDto){
        if(parseInt(culturaDto.id) === NaN){
            throw new BusinessLogicException("La region no puede ser creada", BusinessError.BAD_REQUEST);
        }
        const cultura: CulturaGastronomicaEntity = plainToInstance(CulturaGastronomicaEntity, culturaDto);
        return await this.culturaService.create(cultura);
        
    }
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Put(':culturaId')
    @HasRoles(Role.Editor, Role.Admin, Role.EditorCultura)
    async update(@Param('culturaId') culturaId: string, @Body() culturaDto: CulturagastronomicaDto){
        const cultura: CulturaGastronomicaEntity = plainToInstance(CulturaGastronomicaEntity, culturaDto);
        return await this.culturaService.update(culturaId, cultura);
    }
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Delete(':regionId')
    @HasRoles(Role.Borrar, Role.Admin, Role.BorrarCultura)
    @HttpCode(204)
    async delete(@Param('regionId') regionId: string){
        return await this.culturaService.delete(regionId)
    }
}
