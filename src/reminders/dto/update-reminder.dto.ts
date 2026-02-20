import { IsString, MinLength, IsOptional, IsArray, IsNumber } from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class UpdateReminderDto {
  @ApiPropertyOptional({ example: "День дня", description: "Название напоминания" })
  @IsString({ message: "Должно быть строкой" })
  @MinLength(3, { message: "Не меньше 3 символов" })
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({
    example: "В этот день родился день",
    description: "Описание напоминания",
  })
  @IsString({ message: "Должно быть строкой" })
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    example: "1990-05-12T00:00:00.000Z",
    description: "Старт события",
  })
  @IsString({ message: "Должно быть строкой" })
  @IsOptional()
  dateStart?: Date;

  @ApiPropertyOptional({ example: [1, 2, 3], description: "ID файлов для прикрепления" })
  @IsArray()
  @IsNumber({}, { each: true })
  @IsOptional()
  fileIds?: number[];
}
