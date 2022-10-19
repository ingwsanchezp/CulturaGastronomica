import { CacheModule, Module } from '@nestjs/common';
import { RecetaService } from './receta.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecetaEntity } from './receta.entity';
import { RecetaController } from './receta.controller';
import { RecetaResolver } from './receta.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([RecetaEntity]), CacheModule.register()],
  controllers: [RecetaController,],
  providers: [RecetaService, RecetaResolver, 
  ],
})
export class RecetaModule {}
