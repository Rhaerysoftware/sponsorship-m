import { Injectable } from '@nestjs/common';
import { SponsorshipStatus } from 'src/database/sponsor';
import { Role } from 'src/database/user';
import { IUserCookie } from 'shared/types';
import { NotSponsoredError } from 'src/utils/error';
import MessageDAO from 'src/database/sponsor/message/message.dao';
import SponsorshipDAO from 'src/database/sponsor/sponsorship/sponsorship.dao';
import BaseUser from 'src/database/user/baseUser';
import ChildDAO from 'src/database/user/child/child.DAO';
import UserDAO from 'src/database/user/user/user.DAO';
import ActorMainService from 'src/modules/userModule/actor.main.service';

@Injectable()
export default class MessageService {
  constructor(
    private messageDAO: MessageDAO,
    private sponsorshipDAO: SponsorshipDAO,
    private userDAO: UserDAO,
    private childDAO: ChildDAO,
  ) {}

  public async getMessagesOfUser(actor: IUserCookie) {
    const user =
      actor.role === Role.Child
        ? await this.childDAO.getChild({ userId: actor.userId })
        : actor.role === Role.User
          ? await this.userDAO.getUser({ userId: actor.userId })
          : null;

    if (!user) throw new Error('haya');

    console.log('User', user);

    const actorMessages = await this.sponsorshipDAO.getActorMessages(user);

    console.log(
      'CHILD MESSAGES',
      user.role === Role.Child &&
        (await this.sponsorshipDAO.getChildMessages(user.userId)),
    );

    return { actorMessages, user };
  }

  public async message(
    fromUser: IUserCookie,
    toUser: { userId: number; role: Role },
    sponosrshipId: number,
    message: string,
  ) {
    const { user, child, sponsorship } =
      await this.sponsorshipDAO.getUserChildSponsorship(
        fromUser.userId,
        toUser.userId,
      );

    const to = fromUser.role === Role.User ? Role.Child : Role.User;

    if (sponsorship.status !== SponsorshipStatus.APPROVED)
      throw new NotSponsoredError();

    const messageRecord = await this.messageDAO.createMessage({
      from: fromUser.role,
      to,
      message,
      sponsorship,
    });

    return { user, child, sponsorship, message: messageRecord };
  }

  public async checkIfUserSponosrToChild(
    userId: number,
    childId: number,
    sponsorshipId: number,
  ) {
    const sponosrship =
      await this.sponsorshipDAO.checkIfSponosrshipActive(sponsorshipId);

    return !!sponosrship;
  }

  public messageSponsorship(userId: number, childId: number, message: string) {}
}
