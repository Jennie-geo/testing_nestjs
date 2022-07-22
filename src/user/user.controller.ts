import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { getUser } from '../auth/decorators';
import { JwtGuards } from '../auth/guard';

@UseGuards(JwtGuards)
@Controller('users')
export class UserController {
  @Get('loginuser')
  getUser(@getUser() user: User) {
    return user;
  }
}
