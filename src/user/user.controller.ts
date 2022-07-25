import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from '../auth/decorators';
import { JwtGuards } from '../auth/guard';
import { EditUserDto } from './dto';
import { UserService } from './user.service';

@UseGuards(JwtGuards)
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}
  @Get('loginuser')
  getUser(@GetUser() user: User) {
    return user;
  }

  @Patch()
  editUser(@GetUser('id') userId: number, @Body() userDetails: EditUserDto) {
    return this.userService.editUser(userId, userDetails);
  }
}
