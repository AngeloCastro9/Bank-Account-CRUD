import { HttpException, Injectable } from '@nestjs/common';
import { CreateBankAccountDto } from './dto/create-bank-account.dto';
import { UpdateBankAccountDto } from './dto/update-bank-account.dto';
import { PrismaService } from '../../connections/prisma/prisma.service';
import { BankAccount, User } from '@prisma/client';
import { LogService } from '../../shared/modules/log/log.service';
import { ErrorMessagesEnum } from '../../shared/enums/errors.enum';
import { OperationsDto } from './dto/deposit.dto';

@Injectable()
export class BankAccountService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly log: LogService,
  ) {}
  async create(createBankAccountDto: CreateBankAccountDto, user: User) {
    this.log.info('creating bank account', user.document);

    const account = this.generateRandomEightDigitNumber().toString();
    const bankAccount = await this.prisma.bankAccount.create({
      data: {
        account,
        ...createBankAccountDto,
        user: {
          connect: {
            id: user.id,
          },
        },
      },
      include: {
        user: true,
      },
    });

    this.log.success('bank account created', user.document);

    return bankAccount;
  }

  async update(
    id: string,
    updateBankAccountDto: UpdateBankAccountDto,
  ): Promise<BankAccount> {
    this.log.info('updating bank account', id);

    await this.findOne(id);

    this.log.success('bank account updated', id);

    return this.prisma.bankAccount.update({
      where: {
        id,
      },
      data: updateBankAccountDto,
    });
  }

  async delete(id: string): Promise<BankAccount> {
    this.log.info('deleting bank account', id);

    await this.findOne(id);

    this.log.success('bank account deleted', id);

    return this.prisma.bankAccount.delete({
      where: {
        id,
      },
    });
  }

  async findOne(id: string): Promise<BankAccount> {
    this.log.info('finding bank account', id);
    const bankAccount = await this.prisma.bankAccount.findUnique({
      where: {
        id,
      },
    });

    if (!bankAccount) {
      this.log.error('bank account not found', id);
      throw new HttpException(ErrorMessagesEnum.BANK_ACCOUNT_NOT_FOUND, 400);
    }

    this.log.success('bank account found', id);
    return bankAccount;
  }

  async deposit(id: string, data: OperationsDto): Promise<BankAccount> {
    this.log.info('depositing to bank account', id);

    const bankAccount = await this.findOne(id);

    this.log.success('deposit made', id);

    return this.prisma.bankAccount.update({
      where: {
        id,
      },
      data: {
        balance: bankAccount.balance + data.amount,
      },
    });
  }

  async withdraw(id: string, data: OperationsDto): Promise<BankAccount> {
    this.log.info('withdrawing from bank account', id);

    const bankAccount = await this.findOne(id);

    if (bankAccount.balance < data.amount) {
      this.log.error('insufficient funds', id);
      throw new HttpException(ErrorMessagesEnum.INSUFFICIENT_FUNDS, 400);
    }

    this.log.success('withdraw made', id);

    return this.prisma.bankAccount.update({
      where: {
        id,
      },
      data: {
        balance: bankAccount.balance - data.amount,
      },
    });
  }

  private generateRandomEightDigitNumber(): number {
    return Math.floor(10000000 + Math.random() * 90000000);
  }
}
