import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { bankAccountType } from '../enums/bank-account-type.enum';

export class CreateBankAccountDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Bank ABC' })
  bank: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '1234' })
  agency: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '1' })
  digit: string;

  @IsEnum(bankAccountType)
  @IsNotEmpty()
  @ApiProperty({ example: 'CURRENT' })
  type: string;
}
