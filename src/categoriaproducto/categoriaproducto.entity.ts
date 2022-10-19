import { ProductoEntity } from '../producto/producto.entity';
import {
    Column,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
  } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity()
export class CategoriaproductoEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    nombre: string;
   
    @Field(type => [ProductoEntity])
    @OneToMany(() => ProductoEntity, producto => producto.categoriaProducto )
    productos: ProductoEntity[];

}