import { CulturaGastronomicaEntity } from "../culturagastronomica/culturagastronomica.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
@Entity()
export class RecetaEntity {
    @Field()
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Field()
    @Column()
    nombre: string;

    @Field()
    @Column()
    descripcion: string;

    @Field()
    @Column()
    foto: string;

    @Field()
    @Column()
    preparacion: string;
    
    @Field()
    @Column()
    video: string;

    @Field(type => CulturaGastronomicaEntity)
    @ManyToOne(() => CulturaGastronomicaEntity, 
    (culturagastronomica) => culturagastronomica.recetas)
    culturagastronomica?: CulturaGastronomicaEntity;
}
