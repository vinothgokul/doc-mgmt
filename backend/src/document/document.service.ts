import { ForbiddenException, Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';


@Injectable()
export class DocumentService {
  constructor(
    private databaseService: DatabaseService,
  ) {}

  async create(title: string, file: Express.Multer.File) {
    return await this.databaseService.document.create({
      data: {
        title : title,
        filePath : file.path
      }
    });
  }

  async findAll() {
    const documents = await this.databaseService.document.findMany()

    if(!documents || documents.length === 0)
      throw new ForbiddenException('No documents found')

    return documents
  }

  async findOne(id: number) {
    const document = await this.databaseService.document.findUnique({
      where: {id}
    })

    if(!document)
      throw new ForbiddenException('Document not found');

    return document
  }

  async update(id: number, title: string, file: Express.Multer.File) {
    const document = await this.databaseService.document.findUnique({
      where: {id}
    })

    if(!document) throw new ForbiddenException("Document not Found")

    return await this.databaseService.document.update({
      where: {id},
      data: {
        title : title,
        filePath : file.path
      }
    })
  }

  async remove(id: number) {

    const document = await this.databaseService.document.findUnique({
      where: {id}
    })

    if(!document) throw new ForbiddenException("Document not Found")

    return this.databaseService.document.delete({
      where: {id}
    })
  }

  async triggerIngestion(documentId: number){
    const doc = await this.databaseService.document.findUnique({
      where: {id: documentId}
    })

    if(!doc) throw new ForbiddenException('Document not Found')

    const process = await this.databaseService.ingestionProcess.create({
      data: {
        documentId
      }
    })
    // Logic for Python Connection
    return process;
  }

  async getIngestionStatus(processId: number) {
    const process = await this.databaseService.ingestionProcess.findUnique({
      where: {id: processId}
    })

    if(!process) throw new ForbiddenException("Ingestion Process not found");

    return process
  }
}
