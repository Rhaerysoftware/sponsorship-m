import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToOne,
  Index,
  JoinColumn,
} from 'typeorm';
import { FixNeedStatus } from 'src/database/sponsor';
import Child from 'src/database/user/child/child.entity';
import Sponsorship from 'src/database/sponsor/sponsorship/sponsorship.entity';

class FixNeedRelations {
  @OneToOne(() => Sponsorship, (sponsorship) => sponsorship.fixNeed)
  sponsorship: Sponsorship;

  @ManyToOne(() => Child, (child) => child.fixNeeds)
  child: Child;
}

@Entity()
export default class FixNeed extends FixNeedRelations {
  @Index()
  @PrimaryGeneratedColumn()
  fixNeedId: number;

  @Column('varchar')
  title: string;

  @Column('varchar', { default: 'Default' })
  explanation: string;

  @Column('double')
  amount: number;

  @Column('boolean', { default: false })
  isDeleted: boolean;

  // @Column('varchar')
  // category: string;

  @Column('enum', { enum: FixNeedStatus })
  status: FixNeedStatus;
}
