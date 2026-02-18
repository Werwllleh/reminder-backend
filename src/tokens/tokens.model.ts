import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from "sequelize-typescript";
import { User } from "../users/users.model";

export interface TokenCreationAttributes {
  userId: number
  refreshTokenHash: string
}

@Table({ tableName: "tokens" })
export class Token extends Model<Token, TokenCreationAttributes> {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true, unique: true })
  declare id: number;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: false, unique: true })
  userId: number;

  @Column({ type: DataType.STRING, allowNull: false })
  refreshTokenHash: string;

  @BelongsTo(() => User)
  user: User;
}

