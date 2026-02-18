import { IsInt, IsString, MinLength } from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePostDto {
  @IsString({ message: 'Должно быть строкой' })
  @MinLength(3, { message: 'Не меньше 3 символов' })
  title: string;

  @IsString({ message: 'Должно быть строкой' })
  @MinLength(1, { message: 'Не должно быть пустым' })
  content: string;

  @Type(() => Number)
  @IsInt({ message: 'Должно быть числом' })
  userId: number;
}
