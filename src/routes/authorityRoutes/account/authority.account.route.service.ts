import { Injectable } from '@nestjs/common';
import { LoginDto } from 'shared/dtos';
import { Role } from 'src/database/user';
import UserService from 'src/modules/userModule/userModule/user.service';

@Injectable()
export default class AuthorityAccountService {
  constructor(private userService: UserService) {}

  public async login(requestBody: LoginDto) {
    const user = await this.userService.logIn(requestBody, Role.Authority);
    return this.userService.clearPrivateData(user);
  }
}
