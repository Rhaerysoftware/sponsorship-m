import { Module } from '@nestjs/common';
import GlobalConfigModule from './services/config/config.module';
import MailModule from './services/mail/mail.module';
import FileModule from 'src/services/file/file.module';
import DatabaseModule from 'src/database/main/database.module';
import BusinnessLogicModule from 'src/modules/businnes.logic.module';
import BusinnessRouteModule from 'src/routes/businness.route.module';
import MessageGatewayModule from 'src/websocket/messageGateway/message.gateway.module';
import SocketStorageModule from 'src/services/socketStorage/socketStorage.module';
import { AppService } from 'src/app.service';
import { AppController } from 'src/app.controller';

@Module({
  imports: [
    GlobalConfigModule,
    BusinnessLogicModule,
    BusinnessRouteModule,
    FileModule,
    MailModule,
    DatabaseModule,
    SocketStorageModule,
    MessageGatewayModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export default class SponsorshipApplication {}
