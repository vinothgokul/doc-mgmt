import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, ParseIntPipe, UseInterceptors, UploadedFile } from '@nestjs/common';
import { DocumentService } from './document.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/role.decorator';
import { Role } from '../auth/enums/role.enum';
import { FileInterceptor } from '@nestjs/platform-express';


@Controller('document')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}

  @Post('upload')
  @Roles(Role.ADMIN, Role.EDITOR)
  @UseInterceptors(FileInterceptor('document'))
  create(
    @UploadedFile() file: Express.Multer.File,
    @Body('title') title: string
  ) {
    return this.documentService.create(title, file);
  }

  @Get()
  findAll() {
    return this.documentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.documentService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN,Role.EDITOR)
  @UseInterceptors(FileInterceptor('document'))
  update(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
    @Body('title') title: string) {
    return this.documentService.update(id, title, file);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  remove(@Param('id',ParseIntPipe) id: number) {
    return this.documentService.remove(id);
  }

  @Post(':id/ingestion/start')
  @Roles(Role.ADMIN)
  async triggerIngestion(@Param('id', ParseIntPipe) id: number) {
    return this.documentService.triggerIngestion(id)
  }

  @Get('ingestion/:processId')
  @Roles(Role.ADMIN)
  async getIngestionStatus(@Param('processId', ParseIntPipe) processId: number) {
    return this.documentService.getIngestionStatus(processId)
  }
}
