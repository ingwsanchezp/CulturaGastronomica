import { RegionEntity } from '../region/region.entity';
import { RecetaEntity } from '../receta/receta.entity';
import { PaisEntity } from '../pais/pais.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { ProductoEntity } from '../producto/producto.entity';
import { RestauranteEntity } from '../restaurante/restaurante.entity';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity()
export class CulturaGastronomicaEntity {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  nombre: string;

  @Field()
  @Column()
  descripcion: string;

  @Field(type => RegionEntity)
  @OneToOne(() => RegionEntity, (region) => region.culturagastronomica, {
    cascade: true,
  })
  region: Relation<RegionEntity>;

  @Field(type => [RecetaEntity])
  @OneToMany(() => RecetaEntity, (receta) => receta.culturagastronomica)
  recetas: RecetaEntity[];

  @OneToMany(()=> RestauranteEntity, (restaurante) => restaurante.culturagastronomica)
  restaurantes: RestauranteEntity[];

  @ManyToMany( () => PaisEntity, (pais) => pais.culturasgastronomicas)
  @JoinTable()
  paises: PaisEntity[];

  @Field(type => [ProductoEntity])
  @OneToMany(() => ProductoEntity, (producto) => producto.culturaGastronomica)
  productos: ProductoEntity[];


}