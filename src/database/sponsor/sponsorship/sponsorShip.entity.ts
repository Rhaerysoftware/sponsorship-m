import {
  Index,
  Column,
  Entity,
  OneToOne,
  ManyToOne,
  OneToMany,
  JoinColumn,
  VirtualColumn,
  UpdateDateColumn,
  CreateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { SponsorshipStatus } from 'src/database/sponsor';
import User from 'src/database/user/user/user.entity';
import FixNeed from 'src/database/sponsor/fixNeed/fixNeed.entity';
import SponsorshipPayment from 'src/database/sponsor/sponsorshipPayment/sponsorshipPayment.entity';
import Message from 'src/database/sponsor/message/message.entity';

@Entity()
export default class Sponsorship {
  @Index()
  @PrimaryGeneratedColumn()
  sponsorshipId: number;

  @Column('enum', {
    default: SponsorshipStatus.APPROVED,
    enum: SponsorshipStatus,
  })
  status: SponsorshipStatus;

  @ManyToOne(() => User, (user) => user.sponsor)
  user: User;

  @OneToOne(() => FixNeed, (fixNeed) => fixNeed.sponsorship)
  @JoinColumn()
  fixNeed: FixNeed;

  @OneToMany(() => SponsorshipPayment, (sPayment) => sPayment.sponsorship)
  payment: SponsorshipPayment[];

  @OneToMany(() => Message, (message) => message.sponsorship)
  messages: Message[];

  @VirtualColumn({
    type: 'datetime',
    query: (alias: string) =>
      'SELECT createdAt FROM sponsorship_payment WHERE sponsorship = ' +
      `${alias}.sponsorshipId ` +
      'ORDER BY paymentId LIMIT 1 ',
  })
  lastPaymentDate: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
