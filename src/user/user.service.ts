import { ForbiddenException, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { UpdateUserDto } from './dto/update-user.dto';


@Injectable()
export class UserService {
  constructor(private databaseService: DatabaseService) {}

  findAll() {
    return this.databaseService.user.findMany();
  }

  findOne(id: number) {
    return this.databaseService.user.findUnique({where: {id}});
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.databaseService.user.update({
      where: {id},
      data: {
        role: updateUserDto.role
      }
    })
  }

  remove(id: number) {
    return this.databaseService.user.delete({
      where: {id}
    });
  }
}
