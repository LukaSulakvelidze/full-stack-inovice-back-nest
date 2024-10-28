import { CreateUserDto } from './../users/dto/create-user.dto';
import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('current-user')
  @UseGuards(AuthGuard)
  getUser(@Req() request) {
    return this.authService.getCurrentUser(request.userId);
  }

  @Post('sign-up')
  signUp(@Body() CreateUserDto: CreateUserDto) {
    return this.authService.SignUp(CreateUserDto);
  }

  @Post('sign-in')
  signIn(@Body() SignInDto: SignInDto) {
    return this.authService.SignIn(SignInDto);
  }
}
