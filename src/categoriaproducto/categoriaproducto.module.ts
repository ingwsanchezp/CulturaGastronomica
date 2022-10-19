import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriaproductoEntity } from './categoriaproducto.entity';
import { CategoriaproductoService } from './categoriaproducto.service';
import { CategoriaproductoController } from './categoriaproducto.controller';

@Module({
    imports: [TypeOrmModule.forFeature([CategoriaproductoEntity])],
    controllers: [CategoriaproductoController],
    providers: [CategoriaproductoService,],
  })
export class CategoriaproductoModule {}