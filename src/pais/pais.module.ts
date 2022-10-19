import { CacheModule, Module } from '@nestjs/common';
 import { PaisController } from './pais.controller';
 import { PaisService } from './pais.service';
 import { TypeOrmModule } from '@nestjs/typeorm';
 import { PaisEntity } from './pais.entity';
import { PaisResolver } from './pais.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([PaisEntity]), CacheModule.register()],
  controllers: [PaisController], 
  providers: [PaisService, PaisResolver,]
})
export class PaisModule {}
