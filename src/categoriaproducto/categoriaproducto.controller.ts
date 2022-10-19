import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { CategoriaproductoDto } from './categoriaproducto.dto';
import { CategoriaproductoEntity } from '../categoriaproducto/categoriaproducto.entity';
import {CategoriaproductoService}  from '../categoriaproducto/categoriaproducto.service';
import { plainToInstance } from 'class-transformer';


@Controller('categoriaproducto')
@UseInterceptors(BusinessErrorsInterceptor)
export class CategoriaproductoController {
    constructor(private readonly categoriaProductoService: CategoriaproductoService){}
        
    @Get()
    async findAll() {
      return this.categoriaProductoService.findAll();
    }
    @Get(':categoriaId')
    async findOne(@Param('categoriaId') categoriaId: string) {
        return this.categoriaProductoService.findOne(categoriaId);
    }

    @Post(':categoriaId')
    async create(@Body() CategoriaProductoDto: CategoriaproductoDto) {
        const categoriaProducto: CategoriaproductoEntity = plainToInstance(CategoriaproductoEntity, CategoriaProductoDto);
        return this.categoriaProductoService.create(categoriaProducto);
    }

    @Put(':categoriaId')
    async update(@Param('categoriaId') categoriaId: string, @Body() CategoriaProductoDto: CategoriaproductoDto) {
        const categoriaProducto: CategoriaproductoEntity = plainToInstance(CategoriaproductoEntity, CategoriaProductoDto);
        return this.categoriaProductoService.update(categoriaId, categoriaProducto);
    }

    @Delete(':categoriaId')
    @HttpCode(204)
    async delete(@Param('categoriaId') categoriaId: string) {
        return this.categoriaProductoService.delete(categoriaId);
    }
   
  
}

