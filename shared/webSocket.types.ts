import { Role } from 'src/database/user';

interface MessageUser {
  userId: number;
  role: Role;
}

export interface MessageDTO {
  fromUser: MessageUser;
  toUser: MessageUser;
  sponsorshipId: number;
  message: string;
}

export class MessageCDTO implements MessageDTO {
  constructor(
    public fromUser: MessageUser,
    public toUser: MessageUser,
    public sponsorshipId: number,
    public message: string,
  ) {}
}

export { Role } from 'src/database/user';
