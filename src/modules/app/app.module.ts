import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import { AuthModule } from '../auth/auth.module';
import { AppService } from './app.service';
import { PrismaModule } from '../../connections/prisma/prisma.module';
import { UserModule } from '../user/user.module';
import { MongodbModule } from '../../connections/mongodb/mongodb.module';
import { LogModule } from '../../shared/modules/log/log.module';
import { BankAccountModule } from '../bank-account/bank-account.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    UserModule,
    MongodbModule,
    LogModule,
    BankAccountModule,
  ],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
