import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from 'src/auth/auth.service';

//기본 인증만하는경우는 {} 공백으로둬도되지만,
//인중후 추가작업들이 들어가는경우는  canActivate이후로 추가로 들어가줘야한다.
//로그인후

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {}
