import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty, IsString } from "class-validator";

@InputType()
export class RecetaDto {
    
    readonly id: string;

    @Field()
    @IsString()
    @IsNotEmpty()
    readonly nombre: string;

    @Field()
    @IsString()
    @IsNotEmpty()
    readonly descripcion: string;

    @Field()
    @IsString()
    @IsNotEmpty()
    readonly foto: string;

    @Field()
    @IsString()
    @IsNotEmpty()
    readonly preparacion: string;

    @Field()
    @IsString()
    @IsNotEmpty()
    readonly video: string;

}