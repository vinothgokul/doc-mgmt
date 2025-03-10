import { Test, TestingModule } from '@nestjs/testing';
import { ForbiddenException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { AuthService } from '../auth/auth.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { Role } from '../auth/enums/role.enum';

describe('UserController', () => {
  let userController: UserController;
  let userService: DeepMockProxy<UserService>;
  let authService: DeepMockProxy<AuthService>;

  let mockUser: any;
  let updateUserDto: UpdateUserDto;
  let registerUserDto: Prisma.UserCreateInput;

  beforeEach(async () => {
    userService = mockDeep<UserService>();
    authService = mockDeep<AuthService>();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        { provide: UserService, useValue: userService },
        { provide: AuthService, useValue: authService },
      ],
    }).compile();

    userController = module.get<UserController>(UserController);


    mockUser = { id: 1, username: 'testuser', email: 'test@example.com', role: Role.EDITOR };
    updateUserDto = { username: 'testuser', email: 'test@example.com', role: Role.ADMIN };
    registerUserDto = { username: 'newuser', email: 'newuser@example.com', password: 'password123' };
  });


  describe('create', () => {
    it('should create a new user', async () => {
      authService.registerUser.mockResolvedValue(mockUser);

      const result = await userController.create(registerUserDto);

      expect(authService.registerUser).toHaveBeenCalledWith(registerUserDto);
      expect(result).toEqual(mockUser);
    });
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      userService.findAll.mockResolvedValue([mockUser]);

      const result = await userController.findAll();

      expect(userService.findAll).toHaveBeenCalled();
      expect(result).toEqual([mockUser]);
    });

    it('should throw ForbiddenException if no users exist', async () => {
      userService.findAll.mockRejectedValue(new ForbiddenException('No users found'));

      await expect(userController.findAll()).rejects.toThrow(ForbiddenException);
    });
  });

  describe('findOne', () => {
    it('should return a user if found', async () => {
      userService.findOne.mockResolvedValue(mockUser);

      const result = await userController.findOne(mockUser.id);

      expect(userService.findOne).toHaveBeenCalledWith(mockUser.id);
      expect(result).toEqual(mockUser);
    });

    it('should throw ForbiddenException if user does not exist', async () => {
      userService.findOne.mockRejectedValue(new ForbiddenException('User not found'));

      await expect(userController.findOne(mockUser.id)).rejects.toThrow(ForbiddenException);
    });
  });

  describe('update', () => {
    it('should update a user role', async () => {
      userService.update.mockResolvedValue({ ...mockUser, role: updateUserDto.role });

      const result = await userController.update(mockUser.id, updateUserDto);

      expect(userService.update).toHaveBeenCalledWith(mockUser.id, updateUserDto);
      expect(result).toEqual({ ...mockUser, role: updateUserDto.role });
    });

    it('should throw ForbiddenException if user does not exist', async () => {
      userService.update.mockRejectedValue(new ForbiddenException('User not found'));

      await expect(userController.update(mockUser.id, updateUserDto)).rejects.toThrow(ForbiddenException);
    });
  });

  describe('remove', () => {
    it('should delete a user', async () => {
      userService.remove.mockResolvedValue(mockUser);

      const result = await userController.remove(mockUser.id);

      expect(userService.remove).toHaveBeenCalledWith(mockUser.id);
      expect(result).toEqual(mockUser);
    });

    it('should throw ForbiddenException if user does not exist', async () => {
      userService.remove.mockRejectedValue(new ForbiddenException('User not found'));

      await expect(userController.remove(mockUser.id)).rejects.toThrow(ForbiddenException);
    });
  });
});
