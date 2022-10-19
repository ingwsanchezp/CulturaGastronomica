

import { Controller, Get, Param, UseInterceptors } from '@nestjs/common';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { CiudadService } from './ciudad.service';



@Controller('ciudad')
@UseInterceptors(BusinessErrorsInterceptor)
export class CiudadController {
    constructor(private readonly ciudadService: CiudadService) {}

    @Get()
    async findAll() {
        await this.ciudadService.findAll();
    }

    @Get(':CiudadId')
    async findOne(@Param('CiudadId') CiudadId: string){
        return await this.ciudadService.findOne(CiudadId);
    }

}


