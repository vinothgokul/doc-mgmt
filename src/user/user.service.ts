import { ForbiddenException, Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { UpdateUserDto } from './dto/update-user.dto';


@Injectable()
export class UserService {
  constructor(private databaseService: DatabaseService) {}

  private async userExist(id: number) {
    const user = await this.databaseService.user.findUnique({where: {id}});
    if(!user) throw new ForbiddenException('User not found');
    return user;
  }

  async findAll() {
    const users = await this.databaseService.user.findMany();

    if(!users || users.length === 0)  throw new ForbiddenException('No Users found')
    
    return users;
  }

  async findOne(id: number) {
    return await this.userExist(id)
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    await this.userExist(id)
    
    return await this.databaseService.user.update({
      where: {id},
      data: {
        role: updateUserDto.role
      }
    })
  }

  async remove(id: number) {
    await this.userExist(id)

    return await this.databaseService.user.delete({
      where: {id}
    });
  }
}
