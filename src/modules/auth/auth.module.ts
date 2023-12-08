import { Module } from '@nestjs/common';
import { JwtStrategy } from './strategies/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from '../../connections/prisma/prisma.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { LogModule } from '../../shared/modules/log/log.module';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.AUTH_SECRET,
      signOptions: { expiresIn: '604800s' },
    }),
    PrismaModule,
    UserModule,
    LogModule,
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [],
})
export class AuthModule {}
