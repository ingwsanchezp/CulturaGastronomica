import { Module } from '@nestjs/common';
import { CulturaRecetaService } from './cultura-receta.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CulturaGastronomicaEntity } from '../culturagastronomica/culturagastronomica.entity';
import { RecetaEntity } from '../receta/receta.entity';
import { CulturaRecetaController } from './cultura-receta.controller';

@Module({
  imports:  [TypeOrmModule.forFeature([CulturaGastronomicaEntity, RecetaEntity])],
  controllers: [CulturaRecetaController],
  providers: [CulturaRecetaService]
})
export class CulturaRecetaModule {}
