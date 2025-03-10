import { IsEmail, IsNotEmpty, IsString } from "class-validator";
import { Role } from "../../auth/enums/role.enum";

export class UpdateUserDto {
  
  @IsString()
  @IsNotEmpty()
  username: string

  @IsEmail()
  email: string

  @IsString()
  @IsNotEmpty()
  role: Role
}