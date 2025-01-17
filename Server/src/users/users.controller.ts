import {
  Controller,
  Post,
  UseInterceptors,
  Get,
  UseGuards,
  Body,
  BadRequestException,
  ForbiddenException,
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
  @ApiCookieAuth('connect.sid')
  @ApiOperation({ summary: '내 정보 조회' })
  @Get()
  async getUser(@User() user: Users) {
    console.log(user);
    return user || false;
  }

  //로그인 하는 경우 jwtToken을 생성해서 넘겨줘야하ㅏㄴㄷ.
  // @Controller('api/Signin')
  @ApiOperation({ summary: '로그인' })
  @UseGuards(LocalAuthGuard)
  @Post('signin')
  async login(@User() user: Users) {
    const data = await this.userService.signIn(user);

    console.log(data, 'data');
    return data;
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
