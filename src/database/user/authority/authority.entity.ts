import { Entity, Column, OneToMany } from 'typeorm';
import BaseUser from 'src/database/user/baseUser';
import UserRequest from 'src/database/user/userRequest/userRequest.entity';

@Entity()
export default class Authority extends BaseUser {
  @Column('date')
  dateOfBirth: Date;

  @OneToMany(() => UserRequest, (userRequest) => userRequest.authority)
  userRequests: UserRequest[];
}

/*@OneToMany(
    () => SponsorShipRequest,
    (sponsorshipRequest) => sponsorshipRequest.authority,
  )
  sponsorShipRequests: SponsorShipRequest[];*/
