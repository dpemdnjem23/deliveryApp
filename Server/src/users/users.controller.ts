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
  UseFilters,
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
import { GetBearerToken } from 'src/common/decorators/getToken.decorator';
import { JwtBlacklistGuard } from 'src/auth/guards/jwt-blacklist.guard';

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
  @UseGuards(JwtBlacklistGuard)
  @ApiResponse({ status: 200, description: '로그아웃 성공' })
  @Get('signout')
  async logout(@GetBearerToken() token: string) {
    await this.userService.signOutUser(token);
    return { message: 'Successfully logged out' };
  }
  @ApiOperation({
    summary: '토큰 으로 로그인',
    description: '토큰이 만료되지 않앗다면 다시 로그인한다.',
  })
  @ApiResponse({ status: 200, description: '재발급 성공' })
  @ApiResponse({ status: 419, description: 'expired' })
  @HttpCode(200)
  @Post('refresh')
  async refreshToken(@GetBearerToken() token: string) {
    try {
      const data = await this.authService.refreshAccessToken(token);

      console.log(data);
      return data;
    } catch (err) {
      throw err;
    }
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
