import {
  Body,
  Controller,
  Param,
  ParseIntPipe,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { User } from 'src/middlewares/cookie/cookie.decorator';
import {
  DonateToNeedsDTO,
  IDonateChildNeedDTO,
  ListChildwithNeedsDTO,
} from 'src/routes/userRoutes/childInNeed/childInNeed.interface';
import { IUserCookie } from 'shared/types';
import { Role } from 'src/database/user';
import { CookieInterceptor } from 'src/middlewares/cookie/cookie.middleware';
import ChildInNeedRouteService from 'src/routes/userRoutes/childInNeed/childInNeed.route.service';

@UseInterceptors(new CookieInterceptor(Role.User))
@Controller('user/childsInNeed')
export default class ChildInNeedRouteController {
  constructor(private childInNeedRouteService: ChildInNeedRouteService) {}

  @Post('listChildsWithNeeds/:page')
  public async ListChildWithNeeds(
    @Param('page', ParseIntPipe) page: number,
    @Body() requestBody: ListChildwithNeedsDTO,
  ) {
    const result =
      await this.childInNeedRouteService.listDonatableChildwithNeeds(
        requestBody,
        page,
      );

    return { ok: true, message: 'x', data: result };
  }
  @Post('payNeed')
  public async PayNeed(
    @Body() requestBody: DonateToNeedsDTO,
    @User(Role.User) user: IUserCookie,
  ) {
    const result = await this.childInNeedRouteService.donateToNeeds(
      user,
      requestBody,
    );

    return { ok: true, message: 'Donation has made', data: result };
  }
}
