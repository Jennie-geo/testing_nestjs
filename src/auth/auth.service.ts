import { Injectable } from '@nestjs/common';

@Injectable({})
export class AuthService {
  signup() {
    return { msg: 'I have signup successfully.' };
  }
  login() {
    return { msg: 'I have logged in successfully' };
  }
}
