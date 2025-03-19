import { Controller, Post, Res, Body } from '@nestjs/common';

import { Response } from 'express';
import { Role } from 'src/database/user';

import ChildAccountRouteService from 'src/routes/childRoutes/account/child.route.account.service';
import JwtService from 'src/services/jwt/jwt.service';
import { LoginDto } from 'shared/dtos';

@Controller('child/account')
export default class ChildAccountRouteController {
  private readonly cookieAge: number = 1 * 24 * 60 * 60;
  private readonly tokenName: string = Role.Child + 'Authorization';
  private readonly refreshTokenName: string = Role.Child + 'Refresh';

  constructor(private childAccountService: ChildAccountRouteService) {}

  @Post('/login')
  public async Login(
    @Res({ passthrough: true }) response: Response,
    @Body() requestBody: LoginDto,
  ) {
    console.log('XxXxXxXxX');
    const child = await this.childAccountService.login(requestBody);

    console.log('Child', child);
    const token = JwtService.tokenizeData(child);
    const refreshToken = JwtService.tokenizeData(child, {
      expiresIn: '10d',
    });

    response.cookie(this.tokenName, token, {
      httpOnly: false,
      expires: new Date(2030, 1, 1),
    });
    response.cookie(this.refreshTokenName, refreshToken, {
      httpOnly: false,
      expires: new Date(2030, 1, 1),
    });

    return { ok: true, mesage: 'You are logged in', data: child };
  }
}
