import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from "../users/dto/create-user.dto";
import { UsersService } from "../users/users.service";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcryptjs";
import { User } from '../users/users.model';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(userDto: CreateUserDto) {
    const user = await this.validateUser(userDto);

    if (user) {
      return this.generateToken(user);
    }

    throw new UnauthorizedException({message: 'Данные пользователя не переданы'});
  }

  async registration(userDto: CreateUserDto) {
    const candidate = await this.userService.getUserByEmail(userDto.email);
    if (candidate) {
      throw new HttpException('Пользователь с таким email E-mail уже существует!', HttpStatus.BAD_REQUEST);
    }
    const hashedPassword = await bcrypt.hash(userDto.password, 5);

    const user = await this.userService.createUser({ ...userDto, password: hashedPassword });
    return this.generateToken(user)
  }

  private async generateToken(user: User) {
    const payload = {email: user.email, id: user.id, roles: user.roles};
    return {
      token: this.jwtService.sign(payload),
    }
  }

  private async validateUser(userDto: CreateUserDto) {
    const user = await this.userService.getUserByEmail(userDto.email);

    console.log('User from DB:', user);
    console.log('Password from DB:', user?.password);

    if (!user || !user.password) {
      throw new UnauthorizedException({ message: 'Некорректный email или пароль' });
    }

    const passwordEquals = await bcrypt.compare(userDto.password, user.password);
    if (passwordEquals) {
      return user;
    }

    throw new UnauthorizedException({message: 'Некорректный email или пароль'});
  }
}
