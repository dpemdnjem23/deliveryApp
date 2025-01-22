import {
  Controller,
  Post,
  UseInterceptors,
  Get,
  UseGuards,
  Body,
  BadRequestException,
  ForbiddenException,
  Res,
  Request,
} from '@nestjs/common';
import { UsersService } from './users.service';
import {
  ApiCookieAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UndefinedToNullInterceptor } from 'src/interceptors/undefinedToNull.interceptor';
import { UserDto } from '../common/dto/user.dto';
import { User } from 'src/common/decorators/user.decorator';
import { JoinRequestDto } from './dto/join.request.dto';
import { NotLoggedInGuard } from '../auth/guards/not-logged-in.guard';
import { Users } from 'src/entities/Users.entity';
import { LocalAuthGuard } from 'src/auth/guards/local-auth.guard';
import { AuthGuard } from '@nestjs/passport';
import { LoggedInGuard } from 'src/auth/guards/logged-in.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Response } from 'express';
import { AuthService } from 'src/auth/auth.service';
@UseInterceptors(UndefinedToNullInterceptor)
@ApiTags('USER')
@Controller('api/users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @ApiResponse({
    type: UserDto,
    status: 200,
    description: '성공',
  })
  // @UseGuards(JwtAuthGuard)
  @ApiCookieAuth('connect.sid')
  @ApiOperation({ summary: '내 정보 조회' })
  @Get()
  async getUser(@Request() req: any) {
    console.log(req);
    return { message: 'This is protected data', user: req.user };
  }

  //로그인 하는 경우 jwtToken을 생성해서 넘겨줘야하ㅏㄴㄷ.
  @ApiOperation({ summary: '로그인' })
  // @UseGuards(LoggedInGuard)
  @UseGuards(LocalAuthGuard)
  // @UseGuards(JwtAuthGuard)
  @Post('signin')
  async login(@Request() req: any, @Res() res: any) {
    const user = await this.userService.signIn(req.user, res);

    return user;
  }

  @ApiOperation({ summary: '회원가입' })
  @UseGuards(NotLoggedInGuard)
  @Post('signup')
  async register(@Body() body: JoinRequestDto) {
    const existingUser = await this.userService.findUserByEmail(body.email);

    if (existingUser) {
      throw new BadRequestException('Email already in use');
    }
    const result = await this.userService.registerUser(
      body.email,
      body.nickname,
      body.password,
    );
    if (result) {
      return 'ok';
    } else {
      throw new ForbiddenException();
    }
  }
  //로그아웃

  ///회원탈퇴
}
