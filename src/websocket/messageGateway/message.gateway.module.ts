import { Module, forwardRef } from '@nestjs/common';
import BusinnessLogicModule from 'src/modules/businnes.logic.module';
import MessageGateway from 'src/websocket/messageGateway/message.gateway';

@Module({
  imports: [forwardRef(() => BusinnessLogicModule)],
  providers: [MessageGateway],
})
export default class MessageGatewayModule {}
