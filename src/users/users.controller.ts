import {
  Controller,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Patch()
  @UseGuards(AuthGuard)
  update(@Req() request, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateUser(request.userId, updateUserDto);
  }

  @Delete()
  @UseGuards(AuthGuard)
  remove(@Req() request) {
    return this.usersService.deleteUser(request.userId);
  }
}
