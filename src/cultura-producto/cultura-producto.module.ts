import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CulturaGastronomicaEntity } from '../culturagastronomica/culturagastronomica.entity';
import { ProductoEntity } from '../producto/producto.entity';
import { CulturaProductoService } from './cultura-producto.service';
import { CulturaProductoController } from './cultura-producto.controller';
import { CulturaProductoResolver } from './cultura-producto.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([CulturaGastronomicaEntity, ProductoEntity])],
  controllers: [CulturaProductoController],
  providers: [
    CulturaProductoService,
    CulturaProductoResolver,],
})

export class CulturaRestauranteModule {}
export class CulturaProductoModule {}
