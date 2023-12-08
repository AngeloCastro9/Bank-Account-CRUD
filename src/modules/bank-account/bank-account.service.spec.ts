import { Test, TestingModule } from '@nestjs/testing';
import { BankAccountService } from './bank-account.service';
import { PrismaService } from '../../connections/prisma/prisma.service';
import { LogService } from '../../shared/modules/log/log.service';
import { BankAccount, User } from '@prisma/client';
import { HttpException } from '@nestjs/common';
import { CreateBankAccountDto } from './dto/create-bank-account.dto';
import { UpdateBankAccountDto } from './dto/update-bank-account.dto';

describe('BankAccountService', () => {
  let service: BankAccountService;
  let prismaService: PrismaService;

  const mockBankAccount: BankAccount = {
    id: '1',
    account: '12345678',
    balance: 1000,
    userId: '1',
    agency: '0001',
    bank: '001',
    createdAt: new Date(),
    digit: '1',
    type: 'SAVINGS',
    updatedAt: new Date(),
  };

  const mockUser: User = {
    id: '1',
    email: 'test@test.com',
    name: 'Test User',
    document: '1234567890',
    password: 'hashedpassword',
    phone: '1234567890',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BankAccountService,
        {
          provide: PrismaService,
          useValue: {
            bankAccount: {
              create: jest.fn().mockResolvedValue(mockBankAccount),
              update: jest.fn().mockResolvedValue(mockBankAccount),
              delete: jest.fn().mockResolvedValue(mockBankAccount),
              findUnique: jest.fn().mockResolvedValue(mockBankAccount),
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

    service = module.get<BankAccountService>(BankAccountService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe('create', () => {
    it('should create a new bank account', async () => {
      const createBankAccountDto: CreateBankAccountDto = {
        agency: '0001',
        bank: '001',
        digit: '1',
        type: 'SAVINGS',
      };

      const result = await service.create(createBankAccountDto, mockUser);
      expect(result).toEqual(mockBankAccount);
      expect(prismaService.bankAccount.create).toHaveBeenCalledWith({
        data: {
          account: expect.any(String),
          ...createBankAccountDto,
          user: {
            connect: {
              id: mockUser.id,
            },
          },
        },
        include: {
          user: true,
        },
      });
    });
  });

  describe('findOne', () => {
    it('should return a bank account if found', async () => {
      const id = '1';
      const result = await service.findOne(id);
      expect(result).toEqual(mockBankAccount);
      expect(prismaService.bankAccount.findUnique).toHaveBeenCalledWith({
        where: { id },
      });
    });

    it('should throw HttpException if bank account not found', async () => {
      jest
        .spyOn(prismaService.bankAccount, 'findUnique')
        .mockResolvedValue(null);
      const id = '2';
      await expect(service.findOne(id)).rejects.toThrow(HttpException);
    });
  });

  describe('update', () => {
    it('should update a bank account', async () => {
      const updateBankAccountDto: UpdateBankAccountDto = {
        agency: '0001',
        bank: '001',
        digit: '1',
        type: 'SAVINGS',
      };
      const id = '1';
      const result = await service.update(id, updateBankAccountDto);
      expect(result).toEqual(mockBankAccount);
      expect(prismaService.bankAccount.update).toHaveBeenCalledWith({
        where: { id },
        data: updateBankAccountDto,
      });
    });
  });

  describe('delete', () => {
    it('should delete a bank account', async () => {
      const id = '1';
      const result = await service.delete(id);
      expect(result).toEqual(mockBankAccount);
      expect(prismaService.bankAccount.delete).toHaveBeenCalledWith({
        where: { id },
      });
    });
  });

  describe('deposit', () => {
    it('should deposit an amount to the bank account', async () => {
      const id = '1';
      const operationsDto = { amount: 500 };
      const updatedAccount = {
        ...mockBankAccount,
        balance: mockBankAccount.balance + operationsDto.amount,
      };
      jest
        .spyOn(prismaService.bankAccount, 'update')
        .mockResolvedValue(updatedAccount);
      const result = await service.deposit(id, operationsDto);
      expect(result).toEqual(updatedAccount);
      expect(prismaService.bankAccount.update).toHaveBeenCalledWith({
        where: { id },
        data: { balance: mockBankAccount.balance + operationsDto.amount },
      });
    });
  });

  describe('withdraw', () => {
    it('should withdraw an amount from the bank account', async () => {
      const id = '1';
      const operationsDto = { amount: 200 };
      const updatedAccount = {
        ...mockBankAccount,
        balance: mockBankAccount.balance - operationsDto.amount,
      };
      jest
        .spyOn(prismaService.bankAccount, 'update')
        .mockResolvedValue(updatedAccount);
      const result = await service.withdraw(id, operationsDto);
      expect(result).toEqual(updatedAccount);
      expect(prismaService.bankAccount.update).toHaveBeenCalledWith({
        where: { id },
        data: { balance: mockBankAccount.balance - operationsDto.amount },
      });
    });

    it('should throw HttpException if insufficient funds', async () => {
      const id = '1';
      const operationsDto = { amount: 2000 };
      await expect(service.withdraw(id, operationsDto)).rejects.toThrow(
        HttpException,
      );
    });
  });
});
