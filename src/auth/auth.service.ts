import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserAuth } from './interface';
import * as bcrypt from 'bcrypt';
import { Prisma } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}
  async signup(userDetails: UserAuth) {
    try {
      //hash user password
      const hash_password = await bcrypt.hash(userDetails.password, 10);

      const createUser = await this.prisma.user.create({
        data: {
          email: userDetails.email,
          hash_password,
        },
      });
      delete createUser.hash_password;
      return createUser;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Email already taken');
        }
      }
      throw error;
    }
  }
  async login(userDetails: UserAuth) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: userDetails.email,
      },
    });
    if (!user) throw new ForbiddenException('Email does not exist.');
    const passwordMatches = await bcrypt.compare(
      user.hash_password,
      userDetails.password,
    );
    if (passwordMatches)
      throw new ForbiddenException('Password does not match');
    delete user.hash_password;
    return user;
  }
}
