/* eslint-disable prettier/prettier */
import {IsNotEmpty, IsNumber, IsString, IsUrl} from 'class-validator';

export class RedSocialDto {

    @IsString()
    @IsNotEmpty()
    readonly nombre: string;

    @IsString()
    @IsNotEmpty()
    readonly slogan: string;



}
