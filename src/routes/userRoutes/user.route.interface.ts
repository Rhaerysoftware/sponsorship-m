import { Role } from 'src/database/user';

export class IUserRouteService {
  protected role: Role = Role.User;
}
