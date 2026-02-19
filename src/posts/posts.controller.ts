import {
  Body,
  Controller,
  Post, Req, UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { CreatePostDto } from "./dto/create-post.dto";
import { PostsService } from "./posts.service";
import { FileInterceptor } from '@nestjs/platform-express';

@Controller("posts")
export class PostsController {
  constructor(private readonly postsService: PostsService) {}


  @Post()
  @UseInterceptors(FileInterceptor("file"))
  createPost(@Body() dto: CreatePostDto,
             @Req() req,
             @UploadedFile() file: Express.Multer.File) {
    return this.postsService.create(dto, file);
  }
}
