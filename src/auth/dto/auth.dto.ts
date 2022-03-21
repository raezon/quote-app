import { IsEmail, IsNotEmpty, isNotEmpty, IsString } from "class-validator";
export class AuthDto{
    @IsEmail()
    @IsNotEmpty()
    email:string;

    @IsString()
    @IsNotEmpty()
    password:string;
}