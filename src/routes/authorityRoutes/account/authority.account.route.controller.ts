import { Body, Controller, Post, Res, UseInterceptors } from '@nestjs/common';
import { CookieInterceptor } from 'src/middlewares/cookie/cookie.middleware';
import { Response } from 'express';
import { LoginDto } from 'shared/dtos';
import { Role } from 'src/database/user';
import AuthorityRouteGlobal from 'src/routes/authorityRoutes/authority.route.service';
import JwtService from 'src/services/jwt/jwt.service';
import AuthorityAccountService from 'src/routes/authorityRoutes/account/authority.account.route.service';

@Controller('authority/account')
export default class AuthorityAccountController extends AuthorityRouteGlobal {
  constructor(private authorityRouteService: AuthorityAccountService) {
    super();
  }
  private readonly cookieAge: number = 250 * 24 * 60 * 60;
  private readonly tokenName: string = this.role + 'Authorization';
  private readonly refreshTokenName: string = this.role + 'Refresh';

  @Post('/login')
  public async Login(
    @Res({ passthrough: true }) response: Response,
    @Body() requestBody: LoginDto,
  ) {
    const authority = await this.authorityRouteService.login(requestBody);

    const token = JwtService.tokenizeData(authority);
    const refreshToken = JwtService.tokenizeData(authority, {
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

    return { ok: true, message: 'You are Authorized', data: authority };
  }

  @Post('/logout')
  @UseInterceptors(new CookieInterceptor(Role.Authority))
  public async Logout(@Res({ passthrough: true }) res: Response) {
    console.log('LogoutXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX');
    res.clearCookie(this.tokenName, {
      httpOnly: false,
      maxAge: this.cookieAge,
    });
    res.clearCookie(this.refreshTokenName, {
      httpOnly: false,
      maxAge: this.cookieAge * 2,
    });

    return { ok: true, message: 'Sucessfully Logged Out' };
  }
}
