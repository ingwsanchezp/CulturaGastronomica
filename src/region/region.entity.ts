import { CulturaGastronomicaEntity } from '../culturagastronomica/culturagastronomica.entity';
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, Relation } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';


@ObjectType()
@Entity()
export class RegionEntity {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  nombre: string;

  @OneToOne(
    () => CulturaGastronomicaEntity,
    (culturagastronomica) => culturagastronomica.region
  )
  @JoinColumn()
  culturagastronomica: Relation<CulturaGastronomicaEntity>;
}
