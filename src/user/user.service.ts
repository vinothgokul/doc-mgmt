import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DatabaseService } from 'src/database/database.service';
import { Role } from 'src/auth/enums/role.enum';
import { Roles } from 'src/auth/decorators/role.decorator';


@Injectable()
export class UserService {
  constructor(private databaseService: DatabaseService) {}

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }
  
  findAll() {
    return this.databaseService.user.findMany();
  }

  findOne(id: number) {
    return this.databaseService.user.findUnique({where: {id}});
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates #${id} user`
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
