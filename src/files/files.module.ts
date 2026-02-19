import { Module } from "@nestjs/common";
import { FilesService } from "./files.service";
import { SequelizeModule } from "@nestjs/sequelize";
import { FileModel } from "./files.model";
import { FilesController } from "./files.controller";
import { ReminderFiles } from "./reminder-files.model";

@Module({
  controllers: [FilesController],
  providers: [FilesService],
  imports: [SequelizeModule.forFeature([FileModel, ReminderFiles])],
  exports: [FilesService],
})
export class FilesModule {}
