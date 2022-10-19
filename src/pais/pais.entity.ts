import { Field, ObjectType } from "@nestjs/graphql";
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { CulturaGastronomicaEntity } from '../culturagastronomica/culturagastronomica.entity';

@ObjectType()
@Entity()
export class PaisEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Field()
    @Column()
    nombre: string;

    @Field(type => [CulturaGastronomicaEntity])
    @ManyToMany(() => CulturaGastronomicaEntity, 
    (culturagastronomica) => culturagastronomica.paises)
    culturasgastronomicas?: CulturaGastronomicaEntity[];

}
