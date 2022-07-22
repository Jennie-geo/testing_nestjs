import { ForbiddenException, Injectable } from '@nestjs/common';
//import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { UserAuth } from './interface';
import * as bcrypt from 'bcrypt';
import { Prisma, User } from '@prisma/client';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}
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
      return this.signToken(createUser.id, createUser.email);
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
    return this.signToken(user.id, user.email);
  }

  // function type : Promise<{ access_token: string }>
  async signToken(userId: number, email: string) {
    const payload = {
      sub: userId,
      email,
    };
    const token = await this.jwt.signAsync(payload, {
      expiresIn: '20m',
      secret: this.config.get('JWT_SECRET'),
    });
    return {
      access_token: token,
    };
  }
}
