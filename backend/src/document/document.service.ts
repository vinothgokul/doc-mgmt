import { ForbiddenException, Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';


@Injectable()
export class DocumentService {
  private readonly pythonServiceUrl = 'http://localhost:8000';

  constructor(
    private readonly databaseService: DatabaseService,
    private readonly httpService: HttpService
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
    console.log(doc)
    if(!doc) throw new ForbiddenException('Document not Found')

    const response = await firstValueFrom(this.httpService.post(`${this.pythonServiceUrl}/ingest/${documentId}`))
    console.log(response.data)

    if(response.data.status === 'Completed')
      return {status : response.data.message}
    
    if(response.data.status === 'Pending')
    {
      await this.databaseService.ingestionProcess.create({
        data: {
          documentId: documentId,
          status: response.data.status,
        }
      })
    }

    return response.data;
  }

  async getIngestionStatus(documentId: number) {
    const ingestDoc = await this.databaseService.ingestionProcess.findUnique({
      where: {documentId}
    })

    if(!ingestDoc) throw new ForbiddenException("Ingestion Process not started");

    const response = await firstValueFrom(this.httpService.get(`${this.pythonServiceUrl}/ingestion_status/${documentId}`))

    if(ingestDoc.status !== response.data.status){
      await this.databaseService.ingestionProcess.update({
        where: {documentId},
        data: {
          status: response.data.status
        }
      })
    }

    return response.data;
  }
}
