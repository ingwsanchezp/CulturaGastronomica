import { CulturagastronomicaController } from './culturagastronomica.controller';
import { CulturagastronomicaService } from './culturagastronomica.service';
import { CacheModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CulturaGastronomicaEntity } from './culturagastronomica.entity';
import { CulturagastronomicaResolver } from './culturagastronomica.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([CulturaGastronomicaEntity]), CacheModule.register()],
  controllers: [
    CulturagastronomicaController,],
  providers: [
    CulturagastronomicaService, CulturagastronomicaResolver],
})
export class CulturaGastronomicaModule { }
