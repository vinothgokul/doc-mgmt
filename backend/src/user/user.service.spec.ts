import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { DatabaseService } from '../database/database.service';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { ForbiddenException } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from '../auth/enums/role.enum';

describe('UserService', () => {
  let userService: UserService;
  let databaseService: DeepMockProxy<DatabaseService>;

  let mockUser: any;
  let updateUserDto: UpdateUserDto;

  beforeEach(async () => {
    databaseService = mockDeep<DatabaseService>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: DatabaseService, useValue: databaseService },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);

  
    mockUser = { id: 1, username: 'testuser', email: 'test@example.com', role: Role.EDITOR };
    updateUserDto = { role: Role.ADMIN };
  });


  describe('findAll', () => {
    it('should return all users', async () => {
      databaseService.user.findMany.mockResolvedValue([mockUser]);

      const result = await userService.findAll();

      expect(databaseService.user.findMany).toHaveBeenCalled();
      expect(result).toEqual([mockUser]);
    });

    it('should throw ForbiddenException if no users exist', async () => {
      databaseService.user.findMany.mockResolvedValue([]);

      await expect(userService.findAll()).rejects.toThrow(ForbiddenException);
    });
  });


  describe('findOne', () => {
    it('should return a user if found', async () => {
      databaseService.user.findUnique.mockResolvedValue(mockUser);

      const result = await userService.findOne(mockUser.id);

      expect(databaseService.user.findUnique).toHaveBeenCalledWith({ where: { id: mockUser.id } });
      expect(result).toEqual(mockUser);
    });

    it('should throw ForbiddenException if user does not exist', async () => {
      databaseService.user.findUnique.mockResolvedValue(null);

      await expect(userService.findOne(mockUser.id)).rejects.toThrow(ForbiddenException);
    });
  });


  describe('update', () => {
    it('should update a user role', async () => {
      databaseService.user.findUnique.mockResolvedValue(mockUser);
      databaseService.user.update.mockResolvedValue({ ...mockUser, role: updateUserDto.role });

      const result = await userService.update(mockUser.id, updateUserDto);

      expect(databaseService.user.findUnique).toHaveBeenCalledWith({ where: { id: mockUser.id } });
      expect(databaseService.user.update).toHaveBeenCalledWith({
        where: { id: mockUser.id },
        data: { role: updateUserDto.role },
      });
      expect(result).toEqual({ ...mockUser, role: updateUserDto.role });
    });

    it('should throw ForbiddenException if user does not exist', async () => {
      databaseService.user.findUnique.mockResolvedValue(null);

      await expect(userService.update(mockUser.id, updateUserDto)).rejects.toThrow(ForbiddenException);
    });
  });


  describe('remove', () => {
    it('should delete a user', async () => {
      databaseService.user.findUnique.mockResolvedValue(mockUser);
      databaseService.user.delete.mockResolvedValue(mockUser);

      const result = await userService.remove(mockUser.id);

      expect(databaseService.user.findUnique).toHaveBeenCalledWith({ where: { id: mockUser.id } });
      expect(databaseService.user.delete).toHaveBeenCalledWith({ where: { id: mockUser.id } });
      expect(result).toEqual(mockUser);
    });

    it('should throw ForbiddenException if user does not exist', async () => {
      databaseService.user.findUnique.mockResolvedValue(null);

      await expect(userService.remove(mockUser.id)).rejects.toThrow(ForbiddenException);
    });
  });
});
