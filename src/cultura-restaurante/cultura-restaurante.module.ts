import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CulturaGastronomicaEntity } from '../culturagastronomica/culturagastronomica.entity';
import { RestauranteEntity } from '../restaurante/restaurante.entity';
import { CulturaRestauranteService } from './cultura-restaurante.service';
import { CulturaRestauranteController } from './cultura-restaurante.controller';
import { CulturaRestauranteResolver } from './cultura-restaurante.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([CulturaGastronomicaEntity, RestauranteEntity])],
  controllers: [CulturaRestauranteController],
  providers: [
    CulturaRestauranteService,
    CulturaRestauranteResolver,],
})

export class CulturaRestauranteModule {}
