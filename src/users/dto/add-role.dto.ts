import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class AddRoleDto {
  @IsString({message: 'Должно быть строкой'})
  @IsNotEmpty({message: 'Значение не должно быть пустым'})
  readonly value: string;
  @IsNumber({}, {message: 'Должно быть число'})
  @IsNotEmpty({message: 'UserId не должен быть пустым'})
  readonly userId: number;
}
