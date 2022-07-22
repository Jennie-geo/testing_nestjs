import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { getUser } from 'src/auth/decorators';
import { JwtGuards } from 'src/auth/guard';

@UseGuards(JwtGuards)
@Controller('users')
export class UserController {
  @Get('loginuser')
  getUser(@getUser() user: User) {
    return user;
  }
}
