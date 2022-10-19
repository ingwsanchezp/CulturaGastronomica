import { CulturaRegionController } from './cultura-region.controller';
import { CulturaRegionService } from './cultura-region.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CulturaGastronomicaEntity } from '../culturagastronomica/culturagastronomica.entity';
import { RegionEntity } from '../region/region.entity';
import { CulturaRegionResolver } from './cultura-region.resolver';

@Module({
    imports: [TypeOrmModule.forFeature([CulturaGastronomicaEntity, RegionEntity])],
    controllers: [
        CulturaRegionController, ],
    providers: [
        CulturaRegionService, CulturaRegionResolver],
})
export class CulturaRegionModule { }
