import { Module } from '@nestjs/common';
import { DocumentService } from './document.service';
import { DocumentController } from './document.controller';
import { DatabaseModule } from 'src/database/database.module';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads',
        filename(req, file, callback) {
            const filename = `${Date.now()}-${file.originalname}`;
            callback(null,filename);
        },
      })
    }),
    DatabaseModule,
    
  ],
  controllers: [DocumentController],
  providers: [DocumentService],
})
export class DocumentModule {}
