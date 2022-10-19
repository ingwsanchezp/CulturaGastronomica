import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RestauranteEntity } from './restaurante.entity';
import { RestauranteService } from './restaurante.service';
import { RestauranteController } from './restaurante.controller';
import { RestauranteResolver } from './restaurante.resolver';
@Module({
  imports: [TypeOrmModule.forFeature([RestauranteEntity])],
  controllers: [RestauranteController],
  providers: [RestauranteService, RestauranteResolver],
})

export class RestauranteModule {}
