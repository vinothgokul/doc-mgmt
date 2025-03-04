import { IsNotEmpty, IsString } from "class-validator";
import { Role } from "src/auth/enums/role.enum";

export class UpdateUserDto {
  @IsString()
  @IsNotEmpty()
  role: Role
}