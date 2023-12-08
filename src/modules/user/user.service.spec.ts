import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from '../../connections/prisma/prisma.service';
import { HttpException, HttpStatus } from '@nestjs/common';
import { User } from '@prisma/client';
import { LogService } from '../../shared/modules/log/log.service';
import { CreateUserDto } from './dto/createUser.dto';

describe('UserService', () => {
  let service: UserService;
  let prismaService: PrismaService;

  const mockUser: User = {
    id: '1',
    email: 'test@test.com',
    password: 'hashedpassword',
    name: 'Test User',
    document: '1234567890',
    phone: '1234567890',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: jest.fn().mockResolvedValue(mockUser),
              create: jest.fn().mockResolvedValue(mockUser),
            },
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

    service = module.get<UserService>(UserService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findByDocument', () => {
    it('should return a user if found', async () => {
      const document = '1234567890';
      const user = await service.findByDocument(document);
      expect(user).toEqual(mockUser);
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { document },
      });
    });

    it('should return null if user not found', async () => {
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(null);
      const document = 'nonexistent';
      const user = await service.findByDocument(document);
      expect(user).toBeNull();
    });
  });

  describe('create', () => {
    it('should create and return a user', async () => {
      jest.spyOn(service, 'findByDocument').mockResolvedValue(null);
      const user = await service.create(mockUser);
      expect(user).toEqual(mockUser);
      expect(prismaService.user.create).toHaveBeenCalledWith({
        data: mockUser,
      });
    });

    it('should throw HttpException if user already exists', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@test.com',
        password: 'hashedpassword',
        name: 'Test User',
        document: '1234567890',
        phone: '1234567890',
      };

      jest.spyOn(service, 'findByDocument').mockResolvedValue(mockUser);
      await expect(service.create(createUserDto)).rejects.toThrow(
        new HttpException('USER_ALREADY_EXISTS', HttpStatus.CONFLICT),
      );
    });
  });
});
