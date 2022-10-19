import { AuthModule } from './auth/auth.module';
import { UsuarioModule } from './usuario/usuario.module';
import { CulturaRegionModule } from './cultura-region/cultura-region.module';
import { RegionModule } from './region/region.module';
import { CulturaGastronomicaModule } from './culturagastronomica/culturagastronomica.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RegionEntity } from './region/region.entity';
import { CulturaGastronomicaEntity } from './culturagastronomica/culturagastronomica.entity';
import { RecetaModule } from './receta/receta.module';
import { PaisModule } from './pais/pais.module';
import { RecetaEntity } from './receta/receta.entity';
import { PaisEntity } from './pais/pais.entity';
import { CulturaRecetaModule } from './cultura-receta/cultura-receta.module';
import { PaisCulturaModule } from './pais-cultura/pais-cultura.module';
import { CiudadModule } from './ciudad/ciudad.module';
import { CategoriaproductoModule } from './categoriaproducto/categoriaproducto.module';
import { ProductoModule } from './producto/producto.module';
import { RestauranteModule } from './restaurante/restaurante.module';
import { CiudadEntity } from './ciudad/ciudad.entity';
import { RestauranteEntity } from './restaurante/restaurante.entity';
import { ProductoEntity } from './producto/producto.entity';
import { CategoriaproductoEntity } from './categoriaproducto/categoriaproducto.entity';
import { CulturaRestauranteModule } from './cultura-restaurante/cultura-restaurante.module';
import { CulturaProductoModule } from './cultura-producto/cultura-producto.module';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { ApolloDriver } from '@nestjs/apollo';

@Module({
  imports: [
    AuthModule,
    UsuarioModule,
    CulturaRegionModule,
    RegionModule,
    CulturaGastronomicaModule,
    RecetaModule,
    PaisModule,
    CulturaRecetaModule,
    PaisCulturaModule,
    CiudadModule,
    CategoriaproductoModule,
    ProductoModule,
    RestauranteModule,
    CulturaRestauranteModule,
    CulturaProductoModule,
    GraphQLModule.forRoot({
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      driver: ApolloDriver
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'culturagastronomica',
      entities: [RegionEntity,
        CulturaGastronomicaEntity,
        RecetaEntity,
        PaisEntity,
        ProductoEntity,
        CiudadEntity,
        RestauranteEntity,
        CategoriaproductoEntity],
      dropSchema: true,
      synchronize: true,
      keepConnectionAlive: true,
    }),
    UsuarioModule,
    AuthModule,
    GraphQLModule.forRoot({
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      driver: ApolloDriver
    }),
  ],
  controllers: [AppController],
  providers: [AppService],

})
export class AppModule { }