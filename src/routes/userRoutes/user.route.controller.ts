import { Controller } from '@nestjs/common';
import { UserRouteService } from 'src/routes/userRoutes/user.route.service';

@Controller('user')
export default class UserRouteController {
  constructor(private readonly userRouteService: UserRouteService) {}
}
