import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TokenService } from './token/token.service';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { Role } from './enums/role.enum';
import { BadRequestException, NotFoundException, UnauthorizedException } from '@nestjs/common';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: DeepMockProxy<AuthService>;
  let tokenService: DeepMockProxy<TokenService>;

  let registerUserDto: any;
  let loginUserDto: any;
  let mockUser: any;

  beforeEach(async () => {
    authService = mockDeep<AuthService>();
    tokenService = mockDeep<TokenService>();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: authService
        },
        {
          provide: TokenService,
          useValue: tokenService
        }
      ]
    }).compile();

    authController = module.get<AuthController>(AuthController);

    loginUserDto = { 
      username: 'testuser', 
      password: 'password123'
    };

    registerUserDto = {
      email: 'test@email.com',
      ...loginUserDto
    };

    mockUser = {
      id: 1,
      ...registerUserDto,
      role: Role.VIEWER
    };
  });

  describe('userRegister', () => {
    it('should register a user and return a user object', async () => {
      authService.registerUser.mockResolvedValue(mockUser);

      await expect(authController.userRegister(registerUserDto)).resolves.toEqual(mockUser)
    })
    it('should throw BadRequestException if username already exists', async () => {
      authService.registerUser.mockRejectedValue(new BadRequestException('Username already taken'));

      await expect(authController.userRegister(registerUserDto)).rejects.toThrow(BadRequestException);
    })
  })

  describe('userLogin', () => {
    it('should return a JWT token and return success message', async () => {
      const mockToken = { access_token: 'mocked-jwt-token' };

      authService.loginUser.mockResolvedValue(mockToken)

      const result = await authController.userLogin(loginUserDto)

      expect(result).toEqual(mockToken)
    })
    it('should throw NotFoundException if user does not exist', async () => {
      authService.loginUser.mockRejectedValue(new NotFoundException('User not found'));

      await expect(authController.userLogin(loginUserDto)).rejects.toThrow(NotFoundException);
    })
    it('should throw UnauthorizedException if password is incorrect', async () => {
      authService.loginUser.mockRejectedValue(new UnauthorizedException('Incorrect password'));

      await expect(authController.userLogin(loginUserDto)).rejects.toThrow(UnauthorizedException)
    })
  })

  describe('userLogout', () => {
    it('should revoke token and return success message', () => {
      const mockRequest = {
        headers: {
          authorization: 'Bearer mocked-jwt-token'
        }
      }
      tokenService.revokeToken.mockResolvedValue(undefined);

      expect(authController.userLogout(mockRequest)).toEqual({
        message: 'User logged out successfully'
      })

    })

    it('should throw UnauthorizedException if no token is provided', () => {
      expect(()=>authController.userLogout({headers: {authorization: ''}})).toThrow(UnauthorizedException)
    })
  })
});
