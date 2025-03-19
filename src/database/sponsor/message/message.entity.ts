import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  Index,
} from 'typeorm';
import { Role } from 'src/database/user';
import Sponsorship from 'src/database/sponsor/sponsorship/sponsorship.entity';

@Entity()
export default class Message {
  @Index()
  @PrimaryGeneratedColumn()
  messageId: number;

  @Column('enum', { enum: Role })
  from: Role;

  @Column('enum', { enum: Role })
  to: Role;

  @Column('text')
  message: string;

  @CreateDateColumn()
  date: Date;

  @ManyToOne(() => Sponsorship, (sponsorship) => sponsorship.messages)
  sponsorship: Sponsorship;
}
