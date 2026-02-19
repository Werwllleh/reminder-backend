import {
  Controller,
  Delete,
  Param,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { FilesService } from "./files.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";

@Controller("files")
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post("upload")
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor("file"))
  uploadFile(@UploadedFile() file: Express.Multer.File, @Req() req: any) {
    return this.filesService.createFile(file, req.user.id);
  }

  @Delete("/:id")
  @UseGuards(JwtAuthGuard)
  remove(@Param("id") id: string, @Req() req: any) {
    return this.filesService.deleteFile(Number(id), Number(req.user.id));
  }
}
