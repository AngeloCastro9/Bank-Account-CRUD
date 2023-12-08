import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum, IsOptional } from 'class-validator';
import { bankAccountType } from '../enums/bank-account-type.enum';

export class UpdateBankAccountDto {
  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'Bank ABC Updated' })
  bank?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: '1234' })
  agency?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: '1' })
  digit?: string;

  @IsEnum(bankAccountType)
  @IsOptional()
  @ApiProperty({ example: 'CURRENT' })
  type?: string;
}
