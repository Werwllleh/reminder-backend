import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../users/users.model';

interface PostCreationAttributes {
  title: string;
  content: string;
  userId: number;
  file: string;
}

@Table({
  tableName: "posts",
})
export class Post extends Model<Post, PostCreationAttributes> {
  @ApiProperty({ example: 1, description: "Уникальный идентификатор" })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  declare id: number;

  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
  })
  declare title: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare content: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare file: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
  })
  declare userId: number;

  @BelongsTo(() => User)
  declare author: User;
}
