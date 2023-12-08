import { ApiProperty } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { IsString, IsNotEmpty } from 'class-validator';
import { IsCpf } from '../../../decorators/isCpf.decorator';

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  @IsCpf({ message: 'Invalid CPF' })
  @ApiProperty({ example: '123.456.789-01' })
  document: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '123456' })
  password: string;
}

export class LoginResponseDto {
  user: User;
  message: string;
  token: string;
}
