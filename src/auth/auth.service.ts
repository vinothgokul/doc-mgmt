import { Injectable } from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class AuthService {
  private users:RegisterUserDto[] = [];

  registerUser(registerUserDto: RegisterUserDto) {
    this.users.push(registerUserDto);
    return this.users;
  }

  loginUser(loginUserDto: LoginUserDto) {
    const loginUser = this.users.find(user => user.username === loginUserDto.username && user.password === loginUserDto.password);
    if(loginUser){
      return 'User logged in successfully';
    }
  }
}
