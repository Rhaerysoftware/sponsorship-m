import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import CronService from 'src/services/cron/cron.service';

@Module({
  imports: [ScheduleModule.forRoot()],
  providers: [CronService],
})
export default class CronModule {}
