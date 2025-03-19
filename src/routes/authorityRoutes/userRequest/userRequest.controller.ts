import {
  Get,
  Post,
  Body,
  Query,
  Param,
  Response,
  Controller,
  ParseIntPipe,
  UseInterceptors,
  StreamableFile,
} from '@nestjs/common';
import { Role } from 'src/database/user';
import { User } from 'src/middlewares/cookie/cookie.decorator';
import { IUserCookie } from 'shared/types';
import { AnswerDTO } from 'src/routes/authorityRoutes/userRequest/userRequest.route.dto';
import { CookieInterceptor } from 'src/middlewares/cookie/cookie.middleware';
import UserRequestRouteService from 'src/routes/authorityRoutes/userRequest/userRequest.route.service';
import { Response as Res } from 'express';
import FileService from 'src/services/file/file.service';
@Controller('authority/request')
@UseInterceptors(new CookieInterceptor(Role.Authority))
export default class UserRequestController {
  constructor(
    private userRequestRouteService: UserRequestRouteService,
    private fileSerivce: FileService,
  ) {}

  @Get('/getRequests/:page')
  public async GetRequests(
    @User(Role.Authority) authority: IUserCookie,
    @Param('page', ParseIntPipe) page: number,
  ) {
    const requests = await this.userRequestRouteService.getRequests(
      authority,
      page,
    );

    return {
      ok: true,
      message: 'User Requests Successfully Returned',
      data: requests,
    };
  }

  @Post('getUserData/:userId')
  public async GetUserData(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() { side }: { side: 'front' | 'back' },
  ) {
    const user = await this.userRequestRouteService.getUser(userId);
    const fileData = this.fileSerivce.getFile(user, 'identification');

    const file = side === 'front' ? fileData.front : fileData.back;

    if (side === 'back') console.log(file);

    return new StreamableFile(file);
  }

  @Post('/answer/:requestId')
  public async AnswerRequest(
    @Param('requestId', ParseIntPipe) requestId: number,
    @Body() requestBody: AnswerDTO,
  ) {
    const userRequest = await this.userRequestRouteService.answerRequest(
      requestId,
      requestBody,
    );

    return {
      ok: true,
      message: 'Answer Succesfully saved',
      data: userRequest,
    };
  }
}
