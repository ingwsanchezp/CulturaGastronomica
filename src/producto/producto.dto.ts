import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from "class-validator";
import { CulturaGastronomicaEntity } from '../culturagastronomica/culturagastronomica.entity';
import { CategoriaproductoEntity } from '../categoriaproducto/categoriaproducto.entity';
@InputType()
export class ProductoDto {
    @Field()
    @IsString()
    @IsNotEmpty()
    readonly nombre: string;

    @Field()
    @IsString()
    @IsNotEmpty()
    readonly descripcion: string;

    readonly id: string;

    readonly culturagastronomica: CulturaGastronomicaEntity;

    readonly categoriaProducto: CategoriaproductoEntity;


}
