import { Field, InputType } from '@nestjs/graphql';
import {
    IsNotEmpty,
    IsString
} from 'class-validator';
@InputType()
export class RegionDto {
    
    readonly id: string;

    @Field()
    @IsString()
    @IsNotEmpty()
    readonly nombre: string;
}
