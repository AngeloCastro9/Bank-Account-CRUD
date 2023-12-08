import { Module } from '@nestjs/common';
import { BankAccountService } from './bank-account.service';
import { BankAccountController } from './bank-account.controller';
import { PrismaModule } from '../../connections/prisma/prisma.module';
import { LogModule } from '../../shared/modules/log/log.module';

@Module({
  imports: [PrismaModule, LogModule],
  controllers: [BankAccountController],
  providers: [BankAccountService],
})
export class BankAccountModule {}
