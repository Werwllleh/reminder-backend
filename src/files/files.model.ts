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
import { ReminderFiles } from "./reminder-files.model";
import { Reminder } from "../reminders/reminders.model";

interface FileCreationAttributes {
  userId: number;
  file: string;
  mimeType?: string;
  size?: number;
}

@Table({
  tableName: "files",
})
export class FileModel extends Model<FileModel, FileCreationAttributes> {
  @ApiProperty({ example: 1, description: "Уникальный идентификатор" })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  declare id: number;

  @ApiProperty({ example: 1, description: "Владелец файла" })
  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare userId: number;

  @BelongsTo(() => User)
  declare owner: User;

  @ApiProperty({ example: "uuid.webp" })
  @Column({ type: DataType.STRING, allowNull: false })
  declare file: string;

  @Column({ type: DataType.STRING, allowNull: true })
  declare mimeType?: string;

  @Column({ type: DataType.INTEGER, allowNull: true })
  declare size?: number;

  @BelongsToMany(() => Reminder, () => ReminderFiles)
  declare reminders: Reminder[];
}
