import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe, UsePipes, ValidationPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/auth/decorators/role.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { AuthService } from 'src/auth/auth.service';
import { Prisma } from '@prisma/client';

@Controller('user')
@UseGuards(AuthGuard('jwt'),RolesGuard)
@Roles(Role.ADMIN)
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService 
  ) {}

  @Post()
  create(@Body() registerUserDto: Prisma.UserCreateInput) {
    return this.authService.registerUser(registerUserDto);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe())
  update(@Param('id', ParseIntPipe) id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.userService.remove(id);
  }
}
