import { Module } from '@nestjs/common';
import { PaisCulturaService } from './pais-cultura.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaisEntity } from '../pais/pais.entity';
import { CulturaGastronomicaEntity } from '../culturagastronomica/culturagastronomica.entity';
import { PaisCulturaController } from './pais-cultura.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PaisEntity, CulturaGastronomicaEntity])],
  providers: [PaisCulturaService],
  controllers: [PaisCulturaController]
})
export class PaisCulturaModule {}
