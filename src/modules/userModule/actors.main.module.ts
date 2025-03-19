import { Module, forwardRef } from '@nestjs/common';
import DatabaseModule from 'src/database/main/database.module';
import ActorMainService from 'src/modules/userModule/actor.main.service';
import ChildModule from 'src/modules/userModule/childModule/child.module';
import UserModule from 'src/modules/userModule/userModule/user.module';
import UserRequestModule from 'src/modules/userModule/userRequest/userRequest.module';

const ActorModules = [ChildModule, UserRequestModule, UserModule];

@Module({
  imports: [forwardRef(() => DatabaseModule), ...ActorModules],
  providers: [ActorMainService],
  exports: [...ActorModules, ActorMainService],
})
export default class ActorMainModule {}
