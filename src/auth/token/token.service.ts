import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class TokenService {
  constructor(private databaseService: DatabaseService) {}

  async revokeToken(token: string): Promise<void> {
    await this.databaseService.revokedToken.create({
      data: { token }
    })
  }
  
  async isTokenRevoked(token: string): Promise<boolean> {
    const revokedToken = await this.databaseService.revokedToken.findUnique({
      where: { token }
    })
    return !!revokedToken;
  }
}
