import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  Index,
} from 'typeorm';
import { ChildNeedGroupStatus } from 'src/database/donation';
import ChildNeed from 'src/database/donation/childNeed/childNeed.entity';
import Child from 'src/database/user/child/child.entity';

@Entity()
export default class NeedGroup {
  @Index()
  @PrimaryGeneratedColumn()
  needGroupId: number;

  @Column('varchar')
  title: string;

  @Column('enum', {
    enum: ChildNeedGroupStatus,
    default: ChildNeedGroupStatus.OPEN,
  })
  status: ChildNeedGroupStatus;

  @Column('text')
  explanation: string;

  @OneToMany(() => ChildNeed, (childNeed) => childNeed.group)
  needs: ChildNeed[];

  @ManyToOne(() => Child, (child) => child.needGroups)
  child: Child;
}
