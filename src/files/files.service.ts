import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import * as path from "path";
import { promises as fs } from "fs";
import * as uuid from "uuid";
import { InjectModel } from "@nestjs/sequelize";
import { FileModel } from "./files.model";
import { ReminderFiles } from "./reminder-files.model";
import { Sequelize } from "sequelize-typescript";
import sharp from "sharp";

@Injectable()
export class FilesService {
  constructor(
    @InjectModel(FileModel) private fileRepository: typeof FileModel,
    @InjectModel(ReminderFiles)
    private reminderFilesRepository: typeof ReminderFiles,
    private sequelize: Sequelize,
  ) {}

  async createFile(file: Express.Multer.File, userId: number) {
    if (!file)
      throw new HttpException("Файл не передан", HttpStatus.BAD_REQUEST);
    if (!userId)
      throw new HttpException("userId не определён", HttpStatus.UNAUTHORIZED);

    try {
      const dir = path.resolve(__dirname, "..", "static");
      await fs.mkdir(dir, { recursive: true });

      const isImage = file.mimetype?.startsWith("image/");

      let bufferToSave = file.buffer;
      let mimeType = file.mimetype;
      let ext =
        path.extname(file.originalname) || this.extFromMime(file.mimetype);

      if (isImage) {
        bufferToSave = await sharp(file.buffer)
          .rotate()
          .resize({
            width: 1920,
            height: 1920,
            fit: "inside",
            withoutEnlargement: true,
          })
          .webp({ quality: 80, effort: 4 })
          .toBuffer();

        ext = ".webp";
        mimeType = "image/webp";
      }

      const fileName = `${uuid.v4()}${ext}`;
      await fs.writeFile(path.join(dir, fileName), bufferToSave);

      const row = await this.fileRepository.create({
        userId,
        file: fileName,
        mimeType,
        size: bufferToSave.length, // важно: размер после оптимизации
      });

      return { id: row.id, file: row.file };
    } catch (e) {
      throw new HttpException(
        "Произошла ошибка при записи файла",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteFile(fileId: number, userId: number) {
    if (!fileId)
      throw new HttpException("fileId обязателен", HttpStatus.BAD_REQUEST);
    if (!userId)
      throw new HttpException("userId не определён", HttpStatus.UNAUTHORIZED);

    const t = await this.sequelize.transaction();

    let fileName: string | null = null;

    try {
      const fileRow = await this.fileRepository.findByPk(fileId, {
        transaction: t,
      });

      if (!fileRow)
        throw new HttpException("Файл не найден", HttpStatus.NOT_FOUND);
      if (Number(fileRow.userId) !== Number(userId)) {
        throw new HttpException(
          "Нет прав на удаление файла",
          HttpStatus.FORBIDDEN,
        );
      }

      fileName = fileRow.file;

      await this.reminderFilesRepository.destroy({
        where: { fileId },
        transaction: t,
      });

      await this.fileRepository.destroy({
        where: { id: fileId },
        transaction: t,
      });

      await t.commit();
    } catch (e) {
      await t.rollback();
      throw e;
    }

    if (fileName) {
      const filePath = path.resolve(__dirname, "..", "static", fileName);
      try {
        await fs.unlink(filePath);
      } catch {
        // не валим ответ, если файла на диске нет или не удалился
      }
    }

    return { success: true };
  }

  private extFromMime(mime: string) {
    const map: Record<string, string> = {
      "image/jpeg": ".jpg",
      "image/png": ".png",
      "image/webp": ".webp",
      "video/mp4": ".mp4",
    };
    return map[mime] ?? "";
  }
}
