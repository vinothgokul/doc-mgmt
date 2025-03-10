import { Test, TestingModule } from '@nestjs/testing';
import { TokenService } from './token.service';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { DatabaseService } from '../../database/database.service';

describe('TokenService', () => {
  let tokenService: TokenService;
  let databaseService: DeepMockProxy<DatabaseService>;

  beforeEach(async () => {
    databaseService = mockDeep<DatabaseService>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TokenService,
        {
          provide: DatabaseService,
          useValue: databaseService
        }
      ],
    }).compile();

    tokenService = module.get<TokenService>(TokenService);
  });

  describe('revokeToken', () => {
    it('should save the token in the revoked tokens table', async () => {
      const token = 'mocked-token'
      
      await tokenService.revokeToken(token)

      expect(databaseService.revokedToken.create).toHaveBeenCalledWith({
        data: {token}
      })
    })
  })

  describe('isTokenRevoked', () => {
    it('should return true if the token is revoked', async () => {
      const token = 'revoked-token';
      const mockResult = {
        id: 1,
        token,
        revokedAt: new Date()
      }

      databaseService.revokedToken.findUnique.mockResolvedValue(mockResult)

      const result = await tokenService.isTokenRevoked(token);

      expect(databaseService.revokedToken.findUnique).toHaveBeenCalledWith({
        where: {token},
      })
      expect(result).toBe(true)
    })
    it('should return false if the token is not revoked', async () => {
      const token = 'valid-token';
      databaseService.revokedToken.findUnique.mockResolvedValue(null);

      const result = await tokenService.isTokenRevoked(token);

      expect(databaseService.revokedToken.findUnique).toHaveBeenCalledWith({
        where: {token}
      })
      expect(result).toBe(false)
    })
  })
});
