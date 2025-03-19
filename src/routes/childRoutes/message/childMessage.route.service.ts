import { Injectable } from '@nestjs/common';
import MessageService from 'src/modules/sponsorModule/messageModule/message.service';
import SponsorshipService from 'src/modules/sponsorModule/sponsor/sponsorShip.service';
import { IUserCookie } from 'shared/types';

@Injectable()
export default class ChildMessageRotueService {
  constructor(
    private messageService: MessageService,
    private sponsorshipService: SponsorshipService,
  ) {}

  public async blockUser(child: IUserCookie, sponosrshipId: number) {
    return await this.sponsorshipService.blockSponsorship(sponosrshipId);
  }

  public async getConversations(child: IUserCookie) {
    return await this.messageService.getMessagesOfUser(child);
  }
}
