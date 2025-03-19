import { Controller, Get } from '@nestjs/common';
import UserService from 'src/modules/userModule/userModule/user.service';

@Controller('authority')
export default class AuthorityController {
  private userService: UserService;

  @Get('/')
  public async deneme() {
    console.log('WAY', this.userService.logIn);
    return { ok: true };
  }
}
