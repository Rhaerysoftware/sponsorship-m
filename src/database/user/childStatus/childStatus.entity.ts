import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Index,
} from 'typeorm';
import Child from '../child/child.entity';

@Entity()
export default class ChildStatus {
  @Index()
  @PrimaryGeneratedColumn()
  statusId: number;

  @Column('text')
  text: string;

  @Column('boolean', { default: false })
  isDeleted: boolean;

  @ManyToOne(() => Child, (child) => child.status)
  child: Child;
}
