import { Injectable } from '@nestjs/common';
import { Injector } from 'src/database/utils/repositoryProvider';
import { DeepPartial, Repository } from 'typeorm';
import Message from 'src/database/sponsor/message/message.entity';

@Injectable()
export default class MessageDAO {
  constructor(
    @Injector(Message) private messageRepository: Repository<Message>,
  ) {}

  private async saveMessageEntity(entity: Message) {
    return await this.messageRepository.save(entity);
  }

  public async createMessage(messageAttributes: DeepPartial<Message>) {
    const message = this.messageRepository.create({ ...messageAttributes });

    return await this.saveMessageEntity(message);
  }
}
