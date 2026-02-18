import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';

@ApiTags('Авторизация')
@Controller('auth')
export class AuthController {

  constructor(
    private authService: AuthService,
    private configService: ConfigService
  ) {}

  @Post('/login')
  async login(@Body() userDto: CreateUserDto, @Res({ passthrough: true }) res: any) {
    const { access_token } = await this.authService.login(userDto);
    return { access_token };
  }

  @Post('/registration')
  registration(@Body() userDto: CreateUserDto) {
    return this.authService.registration(userDto);
  }

  @Post('refresh')
  async refresh(@Req() req: any, @Res({ passthrough: true }) res: any) {
    const refreshToken = req.cookies?.refreshToken; // нужно cookie-parser

    const { access_token, refresh_token } = await this.authService.refresh(refreshToken);

    res.cookie('refreshToken', refresh_token, {
      httpOnly: true,
      secure: false, // true на https
      sameSite: 'lax',
      path: '/auth/refresh',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    return { access_token };
  }

  @Post('logout')
  async logout(@Req() req: any, @Res({ passthrough: true }) res: any) {
    const userId = req.user?.id;
    if (userId) await this.authService.logout(userId);

    res.clearCookie('refreshToken', { path: '/auth/refresh' });
    return { ok: true };
  }

}
