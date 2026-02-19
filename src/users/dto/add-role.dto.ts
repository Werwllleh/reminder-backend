import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from "@nestjs/swagger";

export class AddRoleDto {
  @ApiProperty({ example: "Admin", description: "Тип роли" })
  @IsString({ message: "Должно быть строкой" })
  @IsNotEmpty({ message: "Значение не должно быть пустым" })
  readonly value: string;
  @ApiProperty({ example: 1, description: "Id пользователя" })
  @IsNumber({}, { message: "Должно быть число" })
  @IsNotEmpty({ message: "UserId не должен быть пустым" })
  readonly userId: number;
}
