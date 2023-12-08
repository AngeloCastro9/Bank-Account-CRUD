import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class OperationsDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ example: 1000 })
  amount: number;
}
