import { Injectable } from '@nestjs/common';
import { Role } from 'src/database/user';
import UserService from 'src/modules/userModule/userModule/user.service';
import { LoginDto } from 'shared/dtos';

@Injectable()
export default class ChildAccountRouteService {
  constructor(private userService: UserService) {}

  public async login(body: LoginDto) {
    return await this.userService.logIn(body, Role.Child);
  }
}
