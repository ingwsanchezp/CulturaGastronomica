import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role } from '../usuario/role.enum';
import { HasRoles } from '../usuario/roles.decorator';
import { ProductoService } from './producto.service';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { ProductoDto } from './producto.dto';
import { ProductoEntity } from './producto.entity';
import { plainToInstance } from 'class-transformer';

@Controller('producto')
@UseInterceptors(BusinessErrorsInterceptor)
export class ProductoController {
    constructor(private readonly productoService: ProductoService){}
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get()
    @HasRoles(Role.Lector, Role.Admin, Role.LectorProducto)
    async findAll() {
      return this.productoService.findAll();
    }
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get(':productoId')
    @HasRoles(Role.Lector, Role.Admin, Role.LectorProducto)
    async findOne(@Param('productoId') productoId: string): Promise<ProductoEntity> {
        return this.productoService.findOne(productoId);
    }
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Post()
    @HasRoles(Role.Editor, Role.Admin, Role.EditorProducto)
    @Post()
    async create(@Body() productoDto: ProductoDto): Promise<ProductoEntity> {
        const producto: ProductoEntity = plainToInstance(ProductoEntity, productoDto);
        return this.productoService.create(producto);
    }
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Put(':productoId')
    @HasRoles(Role.Editor, Role.Admin, Role.EditorProducto)
    async update(@Param('productoId') productoId: string, @Body() productoDto: ProductoDto): Promise<ProductoEntity> {
        const producto: ProductoEntity = plainToInstance(ProductoEntity, productoDto);
        return this.productoService.update(productoId, producto);
    }
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Delete(':productoId')
    @HasRoles(Role.Borrar, Role.Admin, Role.BorrarProducto)
    @HttpCode(204)
    async delete(@Param('productoId') productoId: string): Promise<void> {
        return this.productoService.delete(productoId);
    }


}
