
import {IsNotEmpty, IsString} from 'class-validator';

export class CategoriaproductoDto {
    
    @IsString()
    @IsNotEmpty()
    readonly nombre: string;

    @IsNotEmpty()
    @IsString()
    readonly id: string;


}
