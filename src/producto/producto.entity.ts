import { CategoriaproductoEntity } from '../categoriaproducto/categoriaproducto.entity'
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { CulturaGastronomicaEntity } from '../culturagastronomica/culturagastronomica.entity';
import { Field, ObjectType } from '@nestjs/graphql';
@ObjectType()
@Entity()
export class ProductoEntity {
 @Field()
 @PrimaryGeneratedColumn('uuid')
 id: string;

 @Field()
 @Column()
 nombre: string;
 
 @Field()
 @Column()
 descripcion: string;
 
 @Field(type  =>CulturaGastronomicaEntity)
 @ManyToOne(() => CulturaGastronomicaEntity, culturaGastronomica => culturaGastronomica.productos )
 culturaGastronomica: CulturaGastronomicaEntity;

 @Field(type  =>CategoriaproductoEntity)
 @ManyToOne(() => CategoriaproductoEntity, categoria => categoria.productos )
 categoriaProducto: CategoriaproductoEntity;
 

}

