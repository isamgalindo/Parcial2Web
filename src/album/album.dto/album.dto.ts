/* eslint-disable prettier/prettier */
import {IsNotEmpty, IsString, IsUrl} from 'class-validator';

export class AlbumDto {
    @IsString()
    @IsNotEmpty()
    readonly fechaInicio: string;
    
    @IsString()
    @IsNotEmpty()
    readonly fechaFin: string;
    
    @IsString()
    @IsNotEmpty()
    readonly titulo: string;
}
