import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, ParseIntPipe } from '@nestjs/common';
import { DocumentService } from './document.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/role.decorator';
import { Role } from 'src/auth/enums/role.enum';

@Controller('document')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}

  @Post()
  @Roles(Role.ADMIN, Role.EDITOR)
  create(
    @Body() body: {title: string, filePath: string}
  ) {
    return this.documentService.create(body.title, body.filePath);
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
  update(@Param('id', ParseIntPipe) id: number, @Body() body: {title: string, filePath: string}) {
    return this.documentService.update(id, body.title, body.filePath);
  }

  @Delete(':id')
  @Roles(Role.ADMIN,Role.EDITOR)
  remove(@Param('id',ParseIntPipe) id: number) {
    return this.documentService.remove(id);
  }
}
