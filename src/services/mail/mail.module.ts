import { Module } from '@nestjs/common';
import GlobalConfigModule from '../config/config.module';
import MailService from './mail.service';

@Module({
  imports: [GlobalConfigModule],
  providers: [MailService],
  exports: [MailService],
})
export default class MailModule {}
