import { Role } from 'src/database/user';

export type ActorPoint = {
  [Role.User]: 1;
  [Role.Authority]: 2;
  [Role.Child]: 3;
};

export interface SocketQuery {
  role: Role;
}
