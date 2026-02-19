import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from "sequelize-typescript";
import { FileModel } from "./files.model";
import { Reminder } from "../reminders/reminders.model";

@Table({
  tableName: "reminder_files",
  createdAt: false,
  updatedAt: false,
})
export class ReminderFiles extends Model<ReminderFiles> {
  @ForeignKey(() => Reminder)
  @Column({ type: DataType.INTEGER, allowNull: false })
  reminderId: number;

  @ForeignKey(() => FileModel)
  @Column({ type: DataType.INTEGER, allowNull: false })
  fileId: number;
}

