import { Injectable, Req } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserAuth } from './interface';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}
  async signup(userDetails: UserAuth) {
    //hash user password
    const hash_password = await bcrypt.hash(userDetails.password, 10);

    const createUser = await this.prisma.user.create({
      data: {
        email: userDetails.email,
        hash_password,
      },
    });
    return createUser;
  }
  login() {
    return { msg: 'I have logged in successfully' };
  }
}
