import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../../connections/prisma/prisma.service';
import { CreateUserDto } from './dto/createUser.dto';
import { User } from '@prisma/client';
import { ErrorMessagesEnum } from '../../shared/enums/errors.enum';
import { LogService } from '../../shared/modules/log/log.service';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly log: LogService,
  ) {}

  async findByDocument(document: string): Promise<User> {
    this.log.info('finding user by document', document);
    const user = await this.prisma.user.findUnique({
      where: {
        document,
      },
    });

    return user;
  }

  async findByEmail(email: string): Promise<User> {
    this.log.info('finding user by email', email);
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    return user;
  }

  async create(data: CreateUserDto): Promise<User> {
    this.log.info('creating user', data.document);
    const findByDocument = await this.findByDocument(data.document);
    const findByEmail = await this.findByEmail(data.email);

    if (findByDocument || findByEmail) {
      this.log.error('user already exists', data.document);
      throw new HttpException(
        ErrorMessagesEnum.USER_ALREADY_EXISTS,
        HttpStatus.CONFLICT,
      );
    }

    this.log.success('user created', data.document);
    return this.prisma.user.create({
      data: {
        ...data,
      },
    });
  }
}
