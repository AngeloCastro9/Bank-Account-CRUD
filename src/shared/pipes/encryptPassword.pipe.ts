import { Injectable, PipeTransform, ArgumentMetadata } from '@nestjs/common';
import { CreateUserDto } from '../../modules/user/dto/createUser.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class ParsePasswordPipe implements PipeTransform {
  async transform(
    user: CreateUserDto,
    metadata: ArgumentMetadata,
  ): Promise<CreateUserDto> {
    if (user.password) {
      const hashedPassword = await bcrypt.hash(user.password, 12);
      return { ...user, password: hashedPassword };
    }
    return user;
  }
}
