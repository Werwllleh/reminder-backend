import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Post } from './posts.model';
import { FilesService } from '../files/files.service';

@Injectable()
export class PostsService {

  constructor(@InjectModel(Post) private postRepository: typeof Post,
              private fileService: FilesService) {
  }

  async create(dto: CreatePostDto, file?: Express.Multer.File) {

    if (!file) {
      throw new BadRequestException('Файл image обязателен');
    }

    // const fileName = await this.fileService.createFile(file)
    // const post = await this.postRepository.create({...dto, file:fileName});
    // return post;
  }
}

