import { Body, Controller, ParseIntPipe, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserAuth } from './interface';

@Controller('auth')
export class AuthController {
  //instantiating the service module
  constructor(private authService: AuthService) {}

  @Post('signup')
  signup(@Body() userDetails: UserAuth) {
    return this.authService.signup(userDetails);
  }

  @Post('login')
  login() {
    return this.authService.login();
  }
}
