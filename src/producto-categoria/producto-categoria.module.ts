import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriaproductoEntity } from '../categoriaproducto/categoriaproducto.entity';
import { ProductoEntity } from 'src/producto/producto.entity';
import { ProductoCategoriaService } from './producto-categoria.service';
import { ProductoCategoriaController } from './producto-categoria.controller';


@Module({
  imports: [TypeOrmModule.forFeature([ProductoEntity, CategoriaproductoEntity])],
  providers: [ProductoCategoriaService],
  controllers: [ProductoCategoriaController]
})

export class ProductoCategoriaModule {}
