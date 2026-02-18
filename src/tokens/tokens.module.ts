import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Token } from './tokens.model';
import { TokensService } from './tokens.service';

@Module({
  controllers: [],
  providers: [TokensService],
  imports: [
    SequelizeModule.forFeature([Token])
  ],
  exports: [
    TokensService,
  ]
})
export class TokensModule {}
