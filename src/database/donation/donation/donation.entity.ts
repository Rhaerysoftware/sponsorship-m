import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Index,
  CreateDateColumn,
} from 'typeorm';
import ChildNeed from 'src/database/donation/childNeed/childNeed.entity';
import User from 'src/database/user/user/user.entity';

@Entity({ name: 'donation' })
export default class Donation {
  @Index()
  @PrimaryGeneratedColumn()
  donationId: number;

  @Column('double', { default: 0 })
  amount: number;

  @ManyToOne(() => ChildNeed, (childNeed) => childNeed.donations)
  @JoinColumn({ name: 'childNeed' })
  childNeed: ChildNeed;

  @ManyToOne(() => User, (user) => user.donations)
  user: User;

  @CreateDateColumn()
  createdAt: Date;
}
