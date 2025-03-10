import { IsEmail } from "class-validator";
import { LoginUserDto } from "./login-user.dto";

export class RegisterUserDto extends LoginUserDto{
  @IsEmail()
  email: string;
}