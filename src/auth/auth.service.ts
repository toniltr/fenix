import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { UsersService } from 'src/users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly i18n: I18nService,
  ) {}

  async register(dto: RegisterDto) {
    const existingUser = await this.usersService.findByEmail(dto.email);

    if (existingUser) {
      throw new BadRequestException(
        this.i18n.t('auth.EMAIL_ALREADY_EXISTS', {
          lang: I18nContext.current()?.lang,
        }),
      );
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);

    const user = await this.usersService.create({
      email: dto.email,
      username: dto.username,
      passwordHash,
    });

    const payload = {
      sub: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    };

    return {
      message: this.i18n.t('auth.REGISTER_SUCCESS', {
        lang: I18nContext.current()?.lang,
      }),
      access_token: await this.jwtService.signAsync(payload),
      user,
    };
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);

    if (!user?.passwordHash) {
      throw new UnauthorizedException(
        this.i18n.t('auth.INVALID_CREDENTIALS', {
          lang: I18nContext.current()?.lang,
        }),
      );
    }

    const ok = await bcrypt.compare(dto.password, user.passwordHash);

    if (!ok) {
      throw new UnauthorizedException(
        this.i18n.t('auth.INVALID_CREDENTIALS', {
          lang: I18nContext.current()?.lang,
        }),
      );
    }

    const payload = {
      sub: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    };

    return {
      message: this.i18n.t('auth.LOGIN_SUCCESS', {
        lang: I18nContext.current()?.lang,
      }),
      access_token: await this.jwtService.signAsync(payload),
      user: {
        id: user.id,
        uuid: user.uuid,
        email: user.email,
        username: user.username,
        role: user.role,
        isActive: user.isActive,
      },
    };
  }

  async validateUser(userId: number) {
    const user = await this.usersService.findById(userId);

    if (!user) {
      throw new UnauthorizedException(
        this.i18n.t('auth.USER_NOT_VALID', {
          lang: I18nContext.current()?.lang,
        }),
      );
    }

    return {
      id: user.id,
      uuid: user.uuid,
      email: user.email,
      username: user.username,
      role: user.role,
      isActive: user.isActive,
    };
  }
}
