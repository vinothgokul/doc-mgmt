import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';
import { DocumentModule } from './document/document.module';

@Module({
  imports: [
    AuthModule, 
    DatabaseModule, 
    UserModule, DocumentModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
