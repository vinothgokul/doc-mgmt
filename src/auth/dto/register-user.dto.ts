import { IsEmail, IsNotEmpty, IsString } from "class-validator";
import { LoginUserDto } from "./login-user.dto";
import { PartialType } from "@nestjs/mapped-types";

export class RegisterUserDto extends PartialType(LoginUserDto){
  @IsEmail()
  email: string;
}