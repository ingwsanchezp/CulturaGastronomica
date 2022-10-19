import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors.interceptor';
import { CategoriaproductoEntity } from '../categoriaproducto/categoriaproducto.entity';
import { ProductoCategoriaService } from './producto-categoria.service';
import { ProductoEntity } from '../producto/producto.entity';
import { ProductoDto } from 'src/producto/producto.dto';

@Controller('producto-categoria')
@UseInterceptors(BusinessErrorsInterceptor)
export class ProductoCategoriaController {
    constructor(private readonly productoCategoriaService: ProductoCategoriaService){}
    //@UseGuards(JwtAuthGuard, RolesGuard)
    @Post('')
    //@HasRoles(Role.Editor, Role.Admin, Role.EditorCultura)
    async addProductoCategoria(@Param('categoriaId') categoriaId: string, @Param('productoId') productoId: string){
        return await this.productoCategoriaService.addProductoCategoria(categoriaId, productoId)
    }

    //@UseGuards(JwtAuthGuard)
    @Get(':categoriaId/productos/:productoId')
    //@HasRoles(Role.Lector, Role.Admin, Role.LectorCultura)
    async findProductoByCategoriaIdProductoId(@Param('categoriaId') categoriaId: string, @Param('productoId') productoId: string){
        return await this.productoCategoriaService.findProductoByCategoriaIdProductoId(categoriaId, productoId);
    }
    
    //@UseGuards(JwtAuthGuard, RolesGuard)
    @Get(':categoriaId/productos')
    //@HasRoles(Role.Lector, Role.Admin, Role.LectorCultura)
    async findProductosByCategoriaId(@Param('categoriaId') categoriaId: string): Promise<ProductoEntity[]>{
            return this.productoCategoriaService.findProductosByCategoriaId(categoriaId);
    }

    //@UseGuards(JwtAuthGuard, RolesGuard)
    @Put(':categoriaId/productos')
    //@HasRoles(Role.Editor, Role.Admin, Role.EditorCultura)
    async associateProductoCategoria(@Body() productosDto: ProductoDto[], @Param('categoriaId') categoriaId: string): Promise<CategoriaproductoEntity>{
        const productos = plainToInstance(ProductoEntity, productosDto)
        return await this.productoCategoriaService.associateProductoCategoria(categoriaId, productos);
    }
    
    //@UseGuards(JwtAuthGuard, RolesGuard)
    @Delete(':categoriaId/productos/:productoId')
    //@HasRoles(Role.Borrar, Role.Admin, Role.BorrarCultura)
    @HttpCode(204)
    async deleteProductoToCategoria(@Param('categoriaId') categoriaId: string, @Param('productoId') productoId: string): Promise<void>{
        return await this.productoCategoriaService.deleteProductoToCategoria(categoriaId, productoId)
    }

        
}
