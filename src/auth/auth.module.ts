import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
//import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategy';

@Module({
  imports: [JwtModule.register({})], //JwtModue.registerasync/register is use to sign jwt token
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
