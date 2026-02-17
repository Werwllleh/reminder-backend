import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {

  @ApiProperty({example: 'user@email.ru', description: 'Email пользователя'})
  readonly email: string;
  @ApiProperty({example: 'password', description: 'Пароль пользователя'})
  readonly password: string;
}
