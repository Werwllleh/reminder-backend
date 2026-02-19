import {
  BelongsTo,
  BelongsToMany,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from "sequelize-typescript";
import { ApiProperty } from "@nestjs/swagger";
import { User } from "../users/users.model";
import { ReminderFiles } from "../files/reminder-files.model";
import { FileModel } from "../files/files.model";


interface ReminderCreationAttributes {
  title: string;
  description?: string;
  dateStart?: Date;
  userId: number;
}

@Table({
  tableName: "reminders",
})
export class Reminder extends Model<Reminder, ReminderCreationAttributes> {
  @ApiProperty({ example: 1, description: "Уникальный идентификатор" })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  declare id: number;

  @ApiProperty({ example: "День дня", description: "Название напоминания" })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare title: string;

  @ApiProperty({
    example: "В этот день родился день",
    description: "Описание напоминания",
  })
  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare description: string;

  @ApiProperty({
    example: "1990-05-12T00:00:00.000Z",
    description: "Старт события",
  })
  @Column({ type: DataType.DATE, allowNull: true })
  declare dateStart: Date;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare userId: number;

  @BelongsTo(() => User)
  declare author: User;

  @BelongsToMany(() => FileModel, () => ReminderFiles)
  declare files: FileModel[];
}
