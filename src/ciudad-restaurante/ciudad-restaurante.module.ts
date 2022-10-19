import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CiudadRestauranteService } from './ciudad-restaurante.service';
import { CiudadEntity } from '../ciudad/ciudad.entity';
import { RestauranteEntity } from '../restaurante/restaurante.entity';
import { CiudadRestauranteController } from './ciudad-restaurante.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CiudadEntity, RestauranteEntity])],
  providers: [CiudadRestauranteService,],
  controllers: [CiudadRestauranteController]
})
export class CiudadRestauranteModule {}
