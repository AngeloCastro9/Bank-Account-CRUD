import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaModule } from '../../connections/prisma/prisma.module';
import { LogModule } from '../../shared/modules/log/log.module';

@Module({
  imports: [PrismaModule, LogModule],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
