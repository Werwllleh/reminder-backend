import {IsString, MinLength } from "class-validator";

export class CreateReminderDto {
  @IsString({ message: "Должно быть строкой" })
  @MinLength(3, { message: "Не меньше 3 символов" })
  title: string;

  @IsString({ message: "Должно быть строкой" })
  description?: string;

  @IsString({ message: "Должно быть строкой" })
  dateStart: Date;

  fileIds?: number[];
}
