import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { HttpException, HttpStatus } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { User } from '@prisma/client';
import { LogService } from '../../shared/modules/log/log.service';

jest.mock('bcryptjs');

describe('AuthService', () => {
  let service: AuthService;
  let userService: UserService;
  let bcryptCompareSpy;

  const mockUser: User = {
    id: '1',
    email: 'test@test.com',
    password: '$2a$10$SomeRandomSaltedHashValue/ForTest',
    name: 'Test User',
    document: '1234567890',
    phone: '1234567890',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: {
            findByDocument: jest.fn().mockResolvedValue(mockUser),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('test-token'),
          },
        },
        {
          provide: LogService,
          useValue: {
            info: jest.fn(),
            error: jest.fn(),
            success: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    bcryptCompareSpy = jest
      .spyOn(bcrypt, 'compare')
      .mockImplementation(() => Promise.resolve(true));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('validateUser', () => {
    it('should validate and login the user with correct credentials', async () => {
      const loginDto = {
        document: mockUser.document,
        password: 'correct-password',
      };
      const result = await service.validateUser(loginDto);
      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('token');
      expect(bcryptCompareSpy).toHaveBeenCalledWith(
        'correct-password',
        mockUser.password,
      );
    });

    it('should throw HttpException if user not found', async () => {
      jest.spyOn(userService, 'findByDocument').mockResolvedValue(null);
      const loginDto = { document: 'wrong-document', password: 'any-password' };
      await expect(service.validateUser(loginDto)).rejects.toThrow(
        new HttpException('INCORRET_CREDENTIALS', HttpStatus.BAD_REQUEST),
      );
    });

    it('should throw HttpException if password is incorrect', async () => {
      bcryptCompareSpy.mockImplementation(() => Promise.resolve(false));
      const loginDto = {
        document: mockUser.document,
        password: 'wrong-password',
      };
      await expect(service.validateUser(loginDto)).rejects.toThrow(
        new HttpException('INCORRET_CREDENTIALS', HttpStatus.BAD_REQUEST),
      );
    });
  });

  describe('login', () => {
    it('should return user data and a token', async () => {
      const result = await service.login(mockUser);
      expect(result).toHaveProperty('user', mockUser);
      expect(result).toHaveProperty('token');
      expect(result).toHaveProperty('message', 'Login successfully.');
    });
  });
});
