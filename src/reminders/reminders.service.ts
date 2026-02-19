import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Reminder } from "./reminders.model";
import { CreateReminderDto } from "./dto/create-reminder.dto";
import { FileModel } from "../files/files.model";
import { Sequelize } from "sequelize-typescript";

@Injectable()
export class RemindersService {
  constructor(
    @InjectModel(Reminder) private reminderRepository: typeof Reminder,
    @InjectModel(FileModel) private fileRepository: typeof FileModel,
    private sequelize: Sequelize,
  ) {}

  async createReminder(dto: CreateReminderDto, userId: number) {
    const t = await this.sequelize.transaction();

    try {

      const { fileIds = [], ...reminderData } = dto;

      const reminder = await this.reminderRepository.create(
        { ...reminderData, userId },
        { transaction: t },
      );

      if (fileIds.length) {
        // 1) берём только существующие файлы
        const files = await this.fileRepository.findAll({
          where: { id: fileIds },
          transaction: t,
        });

        // 2) запрет прикреплять чужие файлы
        const strangers = files.find((f) => f.userId !== userId);
        if (strangers) {
          throw new HttpException(
            "Нельзя прикреплять чужие файлы",
            HttpStatus.FORBIDDEN,
          );
        }

        // 3) создаём связи reminder_files
        await reminder.$set(
          "files",
          files.map((f) => f.id),
          { transaction: t },
        );

        await t.commit();

        return await this.reminderRepository.findByPk(reminder.id, {
          include: [FileModel],
        });
      }

    } catch (e) {
      await t.rollback();
      throw e;
    }
  }
}
