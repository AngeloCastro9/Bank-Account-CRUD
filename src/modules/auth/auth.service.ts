import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User } from '@prisma/client';
import { UserService } from '../user/user.service';
import { LogService } from '../../shared/modules/log/log.service';
import { ErrorMessagesEnum } from '../../shared/enums/errors.enum';
import { LoginDto, LoginResponseDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly log: LogService,
  ) {}

  async validateUser(data: LoginDto): Promise<LoginResponseDto> {
    this.log.info('validating user', data.document);
    const user = await this.userService.findByDocument(data.document);

    if (!user) {
      this.log.error('user not found', data.document);
      throw new HttpException(
        ErrorMessagesEnum.INCORRET_CREDENTIALS,
        HttpStatus.BAD_REQUEST,
      );
    }

    const compare = await bcrypt.compare(data.password, user.password);

    if (!compare) {
      this.log.error('invalid password', data.document);
      throw new HttpException(
        ErrorMessagesEnum.INCORRET_CREDENTIALS,
        HttpStatus.BAD_REQUEST,
      );
    }

    this.log.success('user logged in', data.document);
    return this.login(user);
  }

  async login(user: User) {
    const payload = { sub: user.id, ...user };

    return {
      user,
      message: 'Login successfully.',
      token: this.jwtService.sign(payload),
    };
  }
}
