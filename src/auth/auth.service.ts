import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from "../users/dto/create-user.dto";
import { UsersService } from "../users/users.service";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcryptjs";
import { User } from '../users/users.model';
import { ConfigService } from '@nestjs/config';
import { TokensService } from '../tokens/tokens.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private tokensService: TokensService,
  ) {}

  private async generateTokens(user: User) {
    const payload = { email: user.email, id: user.id, roles: user.roles };

    const access_token = this.jwtService.sign(payload, {
      secret: this.configService.get("JWT_ACCESS_SECRET"),
      expiresIn: this.configService.get("JWT_ACCESS_EXPIRES") || "5m",
    });

    const refresh_token = this.jwtService.sign(payload, {
      secret: this.configService.get("JWT_REFRESH_SECRET"),
      expiresIn: this.configService.get("JWT_REFRESH_EXPIRES") || "30d",
    });

    return { access_token, refresh_token };
  }

  private async saveRefreshToken(userId: number, refreshToken: string) {
    const refreshTokenHash = await bcrypt.hash(refreshToken, 5);

    const existing = await this.tokensService.getHashByUserId(userId);

    if (existing) {
      existing.refreshTokenHash = refreshTokenHash;
      await existing.save();
      return;
    }

    await this.tokensService.addUserHash({ userId, refreshTokenHash });
  }

  async login(userDto: CreateUserDto) {
    const user = await this.validateUser(userDto);

    const tokens = await this.generateTokens(user);
    await this.saveRefreshToken(user.id, tokens.refresh_token);

    return {
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
    };
  }

  async registration(userDto: CreateUserDto) {
    const candidate = await this.userService.getUserByEmail(userDto.email);
    if (candidate) {
      throw new HttpException(
        "Пользователь с таким email E-mail уже существует!",
        HttpStatus.BAD_REQUEST,
      );
    }
    const hashedPassword = await bcrypt.hash(userDto.password, 5);

    const user = await this.userService.createUser({
      ...userDto,
      password: hashedPassword,
    });
    const tokens = await this.generateTokens(user);
    await this.saveRefreshToken(user.id, tokens.refresh_token);

    return {
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
    };
  }

  async refresh(refreshToken: string) {
    if (!refreshToken)
      throw new UnauthorizedException({ message: "Нет refresh токена" });

    let payload: any;
    try {
      payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get("JWT_REFRESH_SECRET"),
      });
    } catch {
      throw new UnauthorizedException({ message: "Невалидный refresh токен" });
    }

    const tokenRow = await this.tokensService.getHashByUserId(payload.id);
    if (!tokenRow)
      throw new UnauthorizedException({ message: "Refresh токен не найден" });

    const isValid = await bcrypt.compare(
      refreshToken,
      tokenRow.refreshTokenHash,
    );
    if (!isValid)
      throw new UnauthorizedException({
        message: "Refresh токен не совпадает",
      });

    const user = await this.userService.getUserByEmail(payload.email);

    if (user) {
      const tokens = await this.generateTokens(user);
      await this.saveRefreshToken(user.id, tokens.refresh_token);
      return tokens;
    }

    throw new UnauthorizedException({ message: "Пользователь не найден" });
  }

  async logout(refreshToken: string) {
    if (!refreshToken) return;

    try {
      const payload: any = this.jwtService.verify(refreshToken, {
        secret: this.configService.get("JWT_REFRESH_SECRET"),
      });

      await this.tokensService.removeHashByUserId(payload.id);
    } catch {
      // если токен уже битый/протух — просто ничего не делаем
    }
  }

  private async validateUser(userDto: CreateUserDto) {
    const user = await this.userService.getUserByEmail(userDto.email);

    if (!user || !user.password) {
      throw new UnauthorizedException({
        message: "Некорректный email или пароль",
      });
    }

    const passwordEquals = await bcrypt.compare(
      userDto.password,
      user.password,
    );
    if (passwordEquals) {
      return user;
    }

    throw new UnauthorizedException({
      message: "Некорректный email или пароль",
    });
  }
}

