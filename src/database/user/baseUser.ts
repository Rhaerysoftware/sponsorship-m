import { IsEmail } from 'class-validator';
import { CityEnum, Role } from 'src/database/user';
import {
  Index,
  Column,
  BeforeInsert,
  BeforeUpdate,
  PrimaryGeneratedColumn,
  AfterUpdate,
} from 'typeorm';

export default abstract class BaseUser {
  @Index()
  @PrimaryGeneratedColumn()
  userId: number;

  @Index()
  @Column('varchar')
  name: string;

  @Column('varchar')
  lastname: string;

  @Column('varchar')
  fullName: string;

  @Column('varchar')
  password: string;

  @IsEmail()
  @Column('varchar')
  email: string;

  @Column({ type: 'enum', enum: Role })
  role: Role;

  @Column('boolean', { default: false })
  isDeleted: boolean;

  @Column('enum', { enum: CityEnum })
  city: CityEnum;

  @AfterUpdate()
  @BeforeUpdate()
  @BeforeInsert()
  private setFullName() {
    this.fullName = this.name + ' ' + this.lastname;
    return this.fullName;
  }
}
