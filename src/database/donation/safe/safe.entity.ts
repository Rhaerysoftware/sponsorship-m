import Child from 'src/database/user/child/child.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  Index,
  JoinColumn,
} from 'typeorm';

@Entity()
export default class Safe {
  @Index()
  @PrimaryGeneratedColumn()
  safeId: number;

  @Column('double', { default: 0 })
  totalMoney: number;

  @OneToOne(() => Child, (child) => child.safe)
  @JoinColumn()
  child: Child;
}
