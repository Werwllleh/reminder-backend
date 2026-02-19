import { Module } from '@nestjs/common';
import { RemindersController } from './reminders.controller';
import { RemindersService } from './reminders.service';
import { SequelizeModule } from "@nestjs/sequelize";
import { User } from "../users/users.model";
import { FilesModule } from "../files/files.module";
import { Reminder } from "./reminders.model";
import { FileModel } from "../files/files.model";
import { ReminderFiles } from "../files/reminder-files.model";

@Module({
  controllers: [RemindersController],
  providers: [RemindersService],
  imports: [
    SequelizeModule.forFeature([User, Reminder, FileModel, ReminderFiles]),
    FilesModule
  ],
})
export class RemindersModule {}
