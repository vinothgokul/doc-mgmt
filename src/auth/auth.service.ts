import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { LoginUserDto } from './dto/login-user.dto';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class AuthService {
  constructor(private readonly databaseService: DatabaseService) {}

  async registerUser(registerUserDto: Prisma.UserCreateInput) {
    return this.databaseService.user.create({
      data: registerUserDto
    });
  }

  async loginUser(loginUserDto: LoginUserDto) {
    const user = await this.databaseService.user.findUnique({
      where: {
        username: loginUserDto.username
      }
    })
    
    if(!user) throw new NotFoundException('User not found');

    const ifPasswordMatch = loginUserDto.password === user.password;

    if(!ifPasswordMatch) throw new NotFoundException('Incorrect password');

    return 'User logged in successfully';
  }
  async getAllUsers() {
    return this.databaseService.user.findMany();
  }
}
