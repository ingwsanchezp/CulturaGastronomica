import { IsNotEmpty, IsString } from "class-validator";
import { Field, InputType } from '@nestjs/graphql';
import { CulturaGastronomicaEntity } from "../culturagastronomica/culturagastronomica.entity";
import { CiudadEntity } from "../ciudad/ciudad.entity";
@InputType()
export class RestauranteDto {
    @Field()
    @IsString()
    @IsNotEmpty()
    readonly nombre: string;
 
    @Field()
    @IsNotEmpty()
    readonly michelin: number;
 
    @Field()
    @IsString()
    @IsNotEmpty()
    readonly  fechaMichelin: string;

    readonly id: string;

    readonly culturagastronomica: CulturaGastronomicaEntity;

    readonly ciudad: CiudadEntity;
 

}
