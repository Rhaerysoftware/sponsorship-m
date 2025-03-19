import { Injectable } from '@nestjs/common';
import { IUserCookie } from 'shared/types';
import MessageService from 'src/modules/sponsorModule/messageModule/message.service';

@Injectable()
export default class UserMessageRotueService {
  constructor(private messageService: MessageService) {}

  public async getConversations(user: IUserCookie) {
    return await this.messageService.getMessagesOfUser(user);
  }
}
