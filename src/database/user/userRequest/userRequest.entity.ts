import {
  Entity,
  Column,
  Index,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Status, Type } from 'src/database/user';
import User from 'src/database/user/user/user.entity';
import Admin from 'src/database/user/admin/admin.entity';
import Authority from 'src/database/user/authority/authority.entity';

@Entity()
export default class UserRequest {
  @Index()
  @PrimaryGeneratedColumn()
  requestId: number;

  @Column('enum', { enum: Type, default: Type.SIGNIN })
  type: Type;

  @Column({ type: 'enum', default: Status.WAITING, enum: Status })
  status: Status;

  @Column('text', { nullable: true })
  adminMessage: string;

  @Column('text', { nullable: true })
  authorityMessage: string;

  @ManyToOne(() => User, (user) => user.loginRequests)
  user: User;

  @ManyToOne(() => Admin, (admin) => admin.userRequests)
  admin: Admin;

  @ManyToOne(() => Authority, (authority) => authority.userRequests)
  authority: Authority;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  upodatedAt: Date;
}
