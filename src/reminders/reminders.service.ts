import { HttpException, HttpStatus, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Reminder } from "./reminders.model";
import { CreateReminderDto } from "./dto/create-reminder.dto";
import { UpdateReminderDto } from "./dto/update-reminder.dto";
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
        const files = await this.fileRepository.findAll({
          where: { id: fileIds },
          transaction: t,
        });

        const strangers = files.find((f) => f.userId !== userId);
        if (strangers) {
          throw new HttpException(
            "Нельзя прикреплять чужие файлы",
            HttpStatus.FORBIDDEN,
          );
        }

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

      await t.commit();

      return reminder;
    } catch (e) {
      await t.rollback();
      throw e;
    }
  }

  async findAllReminders(userId: number): Promise<Reminder[]> {
    return this.reminderRepository.findAll({
      where: { userId },
      include: [FileModel],
      order: [["dateStart", "DESC"]],
    });
  }

  async findOneReminder(id: number, userId: number): Promise<Reminder> {
    const reminder = await this.reminderRepository.findOne({
      where: { id, userId },
      include: [FileModel],
    });

    if (!reminder) {
      throw new NotFoundException("Напоминание не найдено");
    }

    return reminder;
  }

  async updateReminder(
    id: number,
    dto: UpdateReminderDto,
    userId: number,
  ): Promise<Reminder> {
    const t = await this.sequelize.transaction();

    try {
      const reminder = await this.findOneReminder(id, userId);

      const { fileIds, ...reminderData } = dto;

      await reminder.update(reminderData, { transaction: t });

      if (fileIds) {
        const files = await this.fileRepository.findAll({
          where: { id: fileIds },
          transaction: t,
        });

        const strangers = files.find((f) => f.userId !== userId);
        if (strangers) {
          throw new HttpException(
            "Нельзя прикреплять чужие файлы",
            HttpStatus.FORBIDDEN,
          );
        }

        await reminder.$set(
          "files",
          files.map((f) => f.id),
          { transaction: t },
        );
      }

      await t.commit();

      const updatedReminder = await this.reminderRepository.findByPk(id, {
        include: [FileModel],
      });

      if (!updatedReminder) {
        throw new NotFoundException("Напоминание не найдено");
      }

      return updatedReminder;
    } catch (e) {
      await t.rollback();
      throw e;
    }
  }

  async deleteReminder(id: number, userId: number): Promise<void> {
    const reminder = await this.findOneReminder(id, userId);
    await reminder.destroy();
  }
}
