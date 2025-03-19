import { Injectable } from '@nestjs/common';
import { NationalityEnum, Role } from 'src/database/user';
import User from 'src/database/user/user/user.entity';
import UserService from 'src/modules/userModule/userModule/user.service';
import {
  UserIDImages,
  UserRegisterDTO,
} from 'src/routes/userRoutes/account/user.account.route.dto';
import { LoginDto } from 'shared/dtos';

@Injectable()
export default class UserAccountRouteService {
  constructor(private userService: UserService) {}

  public async login(body: LoginDto) {
    const {
      answer,
      donations,
      identifications,
      loginRequests,
      sponsor,
      ...rest
    } = await this.userService.logIn(body, Role.User);

    return rest as User;
  }

  public async register(body: UserRegisterDTO, idImages: UserIDImages) {
    const user = await this.userService.register({
      identifications: [
        {
          idNumber: body.idNumber,
          nationality: NationalityEnum.KKTC,
          files: idImages,
        },
      ],
      ...body,
    });

    return user;
  }
}
