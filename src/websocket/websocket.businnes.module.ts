import { Module, forwardRef } from '@nestjs/common';
import MessageDAO from 'src/database/sponsor/message/message.dao';
import BusinnessLogicModule from 'src/modules/businnes.logic.module';

const WebsocketModules = [];

@Module({
  imports: WebsocketModules,
  exports: WebsocketModules,
})
export default class WebsocketBusinnesModule {}
