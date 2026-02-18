import { BelongsToMany, Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../roles/roles.model';
import { UserRoles } from '../roles/user-roles.model';
import { Post } from '../posts/posts.model';

interface UserCreationAttributes {
  email: string;
  password: string;
}

@Table({
  tableName: 'users',
})
export class User extends Model<User, UserCreationAttributes> {
  @ApiProperty({example: 1, description: 'Уникальный идентификатор'})
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  declare id: number;

  @ApiProperty({example: 'user@email.ru', description: 'Email пользователя'})
  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
  })
  declare email: string;

  @ApiProperty({example: 'password', description: 'Пароль пользователя'})
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare password: string;

  @ApiProperty({example: true, description: 'Забанен или нет'})
  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  declare banned: boolean;

  @ApiProperty({example: 'Нарушил что-то', description: 'Причина бана'})
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare banReason: string;

  @BelongsToMany(() => Role, () => UserRoles)
  declare roles: Role[];

  @HasMany(() => Post)
  posts: Post[];
}
