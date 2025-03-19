import {
  Post,
  Body,
  Controller,
  UploadedFiles,
  UseInterceptors,
  Res,
  Get,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { Role } from 'src/database/user';
import {
  UserIDImages,
  UserRegisterDTO,
} from 'src/routes/userRoutes/account/user.account.route.dto';
import UserAccountRouteService from 'src/routes/userRoutes/account/user.account.route.service';
import JwtService from 'src/services/jwt/jwt.service';
import { LoginDto } from 'shared/dtos';

@Controller('user/account')
export default class UserAccountRouteController {
  private readonly cookieAge: number = 1 * 24 * 60 * 60;
  private readonly tokenName: string = Role.User + 'Authorization';
  private readonly refreshTokenName: string = Role.User + 'Refresh';

  constructor(
    private readonly userAccountRouteService: UserAccountRouteService,
  ) {}

  @Post('/register')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'frontId', maxCount: 1 },
      { name: 'backId', maxCount: 1 },
    ]),
  )
  public async Register(
    @UploadedFiles() idImages: UserIDImages,
    @Body() requestBody: UserRegisterDTO,
  ) {
    console.log('Date', requestBody.dateOfBirth);
    requestBody.dateOfBirth = new Date(requestBody.dateOfBirth);

    console.log('REQUEST BODY', requestBody);

    await this.userAccountRouteService.register(requestBody, idImages);

    return {
      ok: true,
      message:
        'Your regiester request has ben created. When accepted, mail will be send to your email',
      data: null,
    };
  }

  @Post('login')
  public async Login(
    @Body() requestBody: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const user = await this.userAccountRouteService.login(requestBody);

    const token = JwtService.tokenizeData(user);
    const refreshToken = JwtService.tokenizeData(user, {
      expiresIn: '10d',
    });

    console.log(JwtService.deTokenizData(token));

    response.cookie(this.tokenName, token, {
      httpOnly: false,
      expires: new Date(2030, 1, 1),
    });
    response.cookie(this.refreshTokenName, refreshToken, {
      httpOnly: false,
      expires: new Date(2030, 1, 1),
    });

    return { ok: true, message: 'Login Succed', user };
  }

  @Get('logout')
  public async Logout() {
    throw new Error('Not ımplemented');
  }
}
