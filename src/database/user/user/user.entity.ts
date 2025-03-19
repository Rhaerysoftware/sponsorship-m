import { Entity, Column, OneToMany, OneToOne, JoinColumn } from 'typeorm';
import { CityEnum } from 'src/database/user';
import BaseUser from 'src/database/user/baseUser';
import UserRequest from 'src/database/user/userRequest/userRequest.entity';
import Identification from 'src/database/user/identification/identification.entity';
import Sponsorship from 'src/database/sponsor/sponsorship/sponsorship.entity';
import Answer from 'src/database/user/answer/answer.entity';
import Donation from 'src/database/donation/donation/donation.entity';

abstract class UserRelations extends BaseUser {
  @OneToMany(() => UserRequest, (userRequest) => userRequest.user)
  loginRequests: UserRequest[];

  @OneToOne(() => Identification, (identification) => identification.user)
  // @JoinColumn()
  identifications: Identification;

  @OneToMany(() => Sponsorship, (sponsorship) => sponsorship.user)
  sponsor: Sponsorship[];

  @OneToMany(() => Donation, (donation) => donation.user)
  donations: Donation[];

  @OneToOne(() => Answer, (answer) => answer.user)
  @JoinColumn()
  answer: Answer;
}

@Entity()
export default class User extends UserRelations {
  @Column('date')
  dateOfBirth: Date;

  @Column('boolean', { default: false })
  canLogin: boolean;

  @Column('enum', { enum: CityEnum })
  city: CityEnum;

  @OneToMany(() => UserRequest, (userRequest) => userRequest.user)
  loginRequests: UserRequest[];

  /* @OneToMany(() => Sponsorship, (sponsorship) => sponsorship.user)
  sponsor: Sponsorship[];*/

  // @OneToMany(() => Donation, (donation) => donation.user)
  // donations: Donation;
}
