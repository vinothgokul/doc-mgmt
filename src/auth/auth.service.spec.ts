import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { BadRequestException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Role } from './enums/role.enum';
import { DatabaseService } from '../database/database.service';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';

describe('AuthService', () => {
  let authService: AuthService;
  let databaseService: DeepMockProxy<DatabaseService>;
  let jwtService: JwtService;

  let registerUserDto: any;
  let loginUserDto: any;
  let mockUserDto: any;

  beforeEach(async () => {
    databaseService = mockDeep<DatabaseService>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: DatabaseService,
          useValue: databaseService
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('mocked-jwt-token')
          }
        }
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);

    loginUserDto = { 
      username: 'testuser', 
      password: 'password123'
    };

    registerUserDto = {
      email: 'test@email.com',
      ...loginUserDto
    };

    mockUserDto = {
      id: 1,
      ...registerUserDto,
      password: await bcrypt.hash(registerUserDto.password, 10),
      role: Role.VIEWER
    };
  });

  describe('registerUser', () => {
    it('should hash password and create a User', async () => {
      databaseService.user.create.mockResolvedValue(mockUserDto)
  
      const result = await authService.registerUser(registerUserDto)
  
      expect(result).toEqual(mockUserDto);
      expect(result.password).not.toBe(registerUserDto.password);
    });
    it('should throw BadRequestException if username already exists', async () => {
      databaseService.user.create.mockRejectedValue(new BadRequestException('Username already taken'));

      const result = authService.registerUser(registerUserDto)

      await expect(result).rejects.toThrow(BadRequestException)
    })
  })

  describe('loginUser', () => {
    it('should return JWT token when credentials are correct', async () => {
      databaseService.user.findUnique.mockResolvedValue(mockUserDto);
      jest.spyOn(bcrypt, 'compare').mockImplementation(async () => true);

      const result = await authService.loginUser(loginUserDto);
  
      expect(result).toEqual({ access_token: 'mocked-jwt-token'});
    })
    it('should throw NotfoundException if user does not exist', async () => {
      databaseService.user.findUnique.mockResolvedValue(null);

      const result = authService.loginUser(loginUserDto)

      await expect(result).rejects.toThrow(new NotFoundException('User not found'));
    })
    it('should throw NotFoundException if password is incorrect', async () => {
      databaseService.user.findUnique.mockResolvedValue(mockUserDto);
      jest.spyOn(bcrypt, 'compare').mockImplementation(async () => false);

      const result = authService.loginUser(loginUserDto)
      await expect(result).rejects.toThrow(new NotFoundException('Incorrect Password'));

    })
    it('should throw InternalServerErrorException if token generation fails', async () => {
      databaseService.user.findUnique.mockResolvedValue(mockUserDto);
      jest.spyOn(bcrypt, 'compare').mockImplementation(async () => true);
      jest.spyOn(jwtService, 'sign').mockImplementation(()=>{
        throw new Error('Token generation failed');
      })

      const result = authService.loginUser(loginUserDto)

      await expect(result).rejects.toThrow(
        new InternalServerErrorException('Token generation failed')
      )
    })
  })
});
