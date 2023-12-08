import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { BankAccountService } from './bank-account.service';
import { CreateBankAccountDto } from './dto/create-bank-account.dto';
import { UpdateBankAccountDto } from './dto/update-bank-account.dto';
import { CurrentUser } from 'src/decorators/currentUser.decorator';
import { User } from '@prisma/client';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { OperationsDto } from './dto/deposit.dto';

@ApiTags('bank-account')
@Controller('bank-account')
export class BankAccountController {
  constructor(private readonly bankAccountService: BankAccountService) {}

  @Post()
  @ApiResponse({
    status: 200,
    description: 'New bank account created.',
  })
  @ApiBearerAuth()
  create(
    @Body() createBankAccountDto: CreateBankAccountDto,
    @CurrentUser() user: User,
  ) {
    return this.bankAccountService.create(createBankAccountDto, user);
  }

  @Put(':id')
  @ApiResponse({
    status: 200,
    description: 'Bank account updated.',
  })
  @ApiBearerAuth()
  update(
    @Param('id') id: string,
    @Body() updateBankAccountDto: UpdateBankAccountDto,
  ) {
    return this.bankAccountService.update(id, updateBankAccountDto);
  }

  @Delete(':id')
  @ApiResponse({
    status: 200,
    description: 'Bank account deleted.',
  })
  @ApiBearerAuth()
  delete(@Param('id') id: string) {
    return this.bankAccountService.delete(id);
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'Bank accounts found.',
  })
  @ApiBearerAuth()
  findOne(@Param('id') id: string) {
    return this.bankAccountService.findOne(id);
  }

  @Patch(':id')
  @ApiResponse({
    status: 200,
    description: 'Deposit made.',
  })
  @ApiBearerAuth()
  deposit(@Param('id') id: string, @Body() data: OperationsDto) {
    return this.bankAccountService.deposit(id, data);
  }

  @Patch(':id/withdraw')
  @ApiResponse({
    status: 200,
    description: 'Withdraw made.',
  })
  @ApiBearerAuth()
  withdraw(@Param('id') id: string, @Body() data: OperationsDto) {
    return this.bankAccountService.withdraw(id, data);
  }
}
