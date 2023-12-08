import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { IsPublic } from '../../decorators/isPublic.decorator';
import { LoginDto } from './dto/login.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/login')
  @IsPublic()
  @ApiResponse({
    status: 200,
    description: 'The user has been logged in.',
  })
  async login(@Body() data: LoginDto) {
    return this.authService.validateUser(data);
  }
}
