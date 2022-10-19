import { RegionController } from './region.controller';
import { RegionService } from './region.service';
import { CacheModule, Module } from '@nestjs/common';
import { RegionEntity } from './region.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RegionResolver } from './region.resolver';
@Module({
  imports: [TypeOrmModule.forFeature([RegionEntity]), CacheModule.register()],
  controllers: [
    RegionController,],
  providers: [
    RegionService, RegionResolver],
})
export class RegionModule { }
