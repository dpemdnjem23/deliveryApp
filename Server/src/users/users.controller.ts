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
  InternalServerErrorException,
  Delete,
  Param,
  HttpCode,
  HttpStatus,
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
import { ClearCookie } from 'src/common/decorators/clearCookie.decorator';
@UseInterceptors(UndefinedToNullInterceptor)
@ApiTags('USER')
@Controller('api/users')
export class UsersController {
  constructor(
    private userService: UsersService,
    private authService: AuthService,
  ) {}

  @ApiResponse({
    type: UserDto,
    status: 200,
    description: '성공',
  })
  @ApiCookieAuth('connect.sid')
  @ApiOperation({ summary: '내 정보 조회' })
  @UseGuards(JwtAuthGuard)
  @Get()
  async getUser(@User() req: any) {
    try {
      const user = await this.userService.findUserByEmail(req.payload.email);
      delete user.password;
      console.log(user);
      return user; // 정상적으로 응답 보내기
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('서버 오류가 발생했습니다.');
    }
  }

  //로그인 하는 경우 jwtToken을 생성해서 넘겨줘야하ㅏㄴㄷ.
  @ApiOperation({ summary: '로그인' })
  // @UseGuards(LoggedInGuard)
  @UseGuards(LocalAuthGuard)
  // @UseGuards(JwtAuthGuard)
  @HttpCode(200) // 응답 코드를 200으로 변경
  @Post('signin')
  async login(@User() user: any, @Res({ passthrough: true }) res: Response) {
    const data = await this.userService.signIn(user, res);
    const refreshToken = this.authService.generateRefreshToken(user);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true, // 클라이언트에서 접근 불가
      secure: false, // HTTPS 환경에서만 전송
      sameSite: 'lax', // CSRF 방지
      maxAge: 7 * 24 * 60 * 60 * 1000, // 쿠키 유효기간: 7일
    });
    console.log(data, 'data');
    return data;
  }

  @ApiOperation({ summary: '회원가입' })
  // @UseGuards(NotLoggedInGuard)
  @ApiResponse({ status: 200, description: '로그아웃 성공' })
  @Post('signup')
  async register(@Body() body: JoinRequestDto) {
    const { email, password, nickname } = body;
    console.log(email);
    const existingUser = await this.userService.findUserByEmail(email);

    if (existingUser) {
      throw new BadRequestException('Email already in use');
    }
    const result = await this.userService.registerUser(
      email,

      password,
      nickname,
    );
    if (!result) {
      throw new ForbiddenException();
    }
  }

  //로그아웃
  @ApiOperation({ summary: '로그아웃' })
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: 200, description: '로그아웃 성공' })
  @Get('signout')
  async logout(
    @Request() req: Request,
    @ClearCookie('refreshToken') clearCookie: any,
  ) {
    return { message: 'Successfully logged out' };
  }

  ///회원탈퇴
  // @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '회원탈퇴',
    description: '현재 로그인한 사용자의 계정을 삭제합니다.',
  })
  @ApiResponse({ status: 204, description: '회원탈퇴 성공' })
  @Delete(':id')
  async delUser(@Param('id') id: number) {
    console.log(id);
    return await this.userService.deleteUser(id);
  }
}
