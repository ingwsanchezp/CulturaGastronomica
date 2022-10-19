
import { CiudadEntity } from '../ciudad/ciudad.entity';
import { CulturaGastronomicaEntity } from '../culturagastronomica/culturagastronomica.entity';
import { Column, Entity,ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity()
export class RestauranteEntity {
    @Field()
    @PrimaryGeneratedColumn('uuid')
    id: string;
   
    @Field()
    @Column()
    nombre: string;
    
    @Field()
    @Column()
    michelin: number;
    
    @Field()
    @Column()
    fechaMichelin: string;

    @Field(type => CiudadEntity)
    @ManyToOne(() => CiudadEntity, ciudad => ciudad.id)
    ciudad: CiudadEntity;

    @Field(type => CulturaGastronomicaEntity)
    @ManyToOne(() => CulturaGastronomicaEntity, culturagastronomica => culturagastronomica.recetas )
    culturagastronomica: CulturaGastronomicaEntity;

}

