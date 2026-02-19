import { Body, Controller, Post, Req, Res } from "@nestjs/common";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import { CreateUserDto } from "../users/dto/create-user.dto";
import { AuthService } from "./auth.service";
import { ConfigService } from "@nestjs/config";

@ApiTags("Авторизация")
@Controller("auth")
export class AuthController {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {}

  @Post("/login")
  @ApiResponse({ status: 200 })
  async login(
    @Body() userDto: CreateUserDto,
    @Res({ passthrough: true }) res: any,
  ) {
    const { access_token, refresh_token } =
      await this.authService.login(userDto);
    res.cookie("access_token", access_token, {
      httpOnly: true,
      sameSite: "lax",
    });

    res.cookie("refresh_token", refresh_token, {
      httpOnly: true,
      sameSite: "lax",
    });

    return { success: true };
  }

  @Post("/registration")
  @ApiResponse({ status: 200 })
  async registration(
    @Body() userDto: CreateUserDto,
    @Res({ passthrough: true }) res: any,
  ) {
    const { access_token, refresh_token } =
      await this.authService.registration(userDto);

    res.cookie("access_token", access_token, {
      httpOnly: true,
      sameSite: "lax",
    });

    res.cookie("refresh_token", refresh_token, {
      httpOnly: true,
      sameSite: "lax",
    });

    return { success: true };
  }

  @Post("/refresh")
  async refresh(@Req() req: any, @Res({ passthrough: true }) res: any) {
    const refreshToken = req.cookies?.refresh_token;

    const { access_token, refresh_token } =
      await this.authService.refresh(refreshToken);

    // ✅ access_token доступен на всём сайте
    res.cookie("access_token", access_token, {
      httpOnly: true,
      secure: false, // true на https
      sameSite: "lax",
      path: "/",
      maxAge: 5 * 60 * 1000, // 5 минут
    });

    res.cookie("refresh_token", refresh_token, {
      httpOnly: true,
      secure: false, // true на https
      sameSite: "lax",
      path: "/auth/refresh",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 дней
    });

    return { ok: true };
  }

  @Post("/logout")
  async logout(@Req() req: any, @Res({ passthrough: true }) res: any) {
    const refreshToken = req.cookies?.refresh_token;

    if (refreshToken) {
      await this.authService.logout(refreshToken);
    }

    res.clearCookie("access_token", { path: "/" });
    res.clearCookie("refresh_token", { path: "/auth/refresh" });

    return { success: true };
  }
}
