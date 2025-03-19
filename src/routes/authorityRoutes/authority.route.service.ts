import { Role } from 'src/database/user';

export default abstract class AuthorityRouteGlobal {
  protected role: Role = Role.Authority;
}
