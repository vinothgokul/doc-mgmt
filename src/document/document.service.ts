import { ForbiddenException, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class DocumentService {
  constructor(private databaseService: DatabaseService) {}

  async create(title: string, filePath: string) {
    return this.databaseService.document.create({
      data: {
        title,
        filePath
      }
    });
  }

  async findAll() {
    return this.databaseService.document.findMany()
  }

  async findOne(id: number) {
    return this.databaseService.document.findUnique({
      where: {id}
    })
  }

  async update(id: number, title: string, filePath: string) {
    const document = this.databaseService.document.findUnique({
      where: {id}
    })

    if(!document) throw new ForbiddenException("Doc not Found")

    return this.databaseService.document.update({
      where: {id},
      data: {
        title,
        filePath
      }
    })
  }

  async remove(id: number) {

    const document = this.databaseService.document.findUnique({
      where: {id}
    })

    if(!document) throw new ForbiddenException("Doc not Found")

    return this.databaseService.document.delete({
      where: {id}
    })
  }
}
