import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Token } from "./tokens.model";
import { AddHashDto } from "./dto/add-hash.dto";

@Injectable()
export class TokensService {
  constructor(
    @InjectModel(Token) private readonly tokenRepository: typeof Token,
  ) {}

  async getHashByUserId(userId: number) {
    const refreshTokenHash = await this.tokenRepository.findOne({ where: { userId } });
    return refreshTokenHash;
  }

  /*async addUserHash(dto: AddHashDto) {
    const hash = await this.tokenRepository.create(dto);
    return hash;
  }*/

  async addUserHash(dto: AddHashDto) {
    // если запись уже есть — обновляем, иначе создаём
    const [row] = await this.tokenRepository.upsert(
      { userId: dto.userId, refreshTokenHash: dto.refreshTokenHash },
      { returning: true },
    )
    return row
  }

  async removeHashByUserId(userId: number) {
    return await this.tokenRepository.destroy({ where: { userId } });
  }
}
