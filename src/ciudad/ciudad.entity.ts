import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { RestauranteEntity } from '../restaurante/restaurante.entity';
import { Field, ObjectType } from '@nestjs/graphql';
@ObjectType()
@Entity()
export class CiudadEntity {

    @Field()
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Field()
    @Column()
    nombre: string;

    @Field(type => [RestauranteEntity])
    @OneToMany(() => RestauranteEntity, restaurante => restaurante.ciudad)      
    restaurantes: RestauranteEntity[];
   
    
}