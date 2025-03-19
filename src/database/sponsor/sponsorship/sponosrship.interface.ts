import { FindOptionsWhere } from 'typeorm';
import type Sponsorship from 'src/database/sponsor/sponsorship/sponsorship.entity';
import type Child from 'src/database/user/child/child.entity';
import type User from 'src/database/user/user/user.entity';
import type Message from 'src/database/sponsor/message/message.entity';

export type FindSponsorship = FindOptionsWhere<Sponsorship>;

export interface ActorMessage {
  user: Child | User;
  sponsorship: Sponsorship;
  messages: Message[];
}

export interface ISponsorshipHistory {
  userId?: number;
  childId?: number;
  fixNeedId?: number;
  range?: [Date, Date];
}
