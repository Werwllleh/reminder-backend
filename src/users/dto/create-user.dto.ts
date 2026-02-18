import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateUserDto {

  @ApiProperty({example: 'user@email.ru', description: 'Email пользователя'})
  @IsString({ message: 'Должно быть строкой' })
  @IsEmail({}, { message: 'Должно быть строкой' })
  readonly email: string;
  @ApiProperty({example: 'password', description: 'Пароль пользователя'})
  @IsString({ message: 'Должно быть строкой' })
  @IsNotEmpty({ message: 'Пароль не может быть пустым' })
  @Length(8, 12, {message: 'Не меньше 8 символов'})
  readonly password: string;
}
