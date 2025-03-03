import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login-user.dto';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly databaseService: DatabaseService,
    private jwtService: JwtService
  ) {}

  async registerUser(registerUserDto: Prisma.UserCreateInput) {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(registerUserDto.password, saltRounds);

    return this.databaseService.user.create({
      data: {
        ...registerUserDto,
        password: hashedPassword
      }
    });
  }

  async loginUser(loginUserDto: LoginUserDto) {
    const user = await this.databaseService.user.findUnique({
      where: {
        username: loginUserDto.username
      }
    })
    
    if(!user) throw new NotFoundException('User not found');

    const ifPasswordMatch = await bcrypt.compare(loginUserDto.password, user.password);

    if(!ifPasswordMatch) throw new NotFoundException('Incorrect password');

    const payload = { sub: user.id, username: user.username, role: user.role };

    return {
      access_token: await this.jwtService.sign(payload)
    }
  }
}
