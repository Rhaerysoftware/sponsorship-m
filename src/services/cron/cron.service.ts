import { Injectable } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { ServerError } from 'src/utils/error';
import Sponsorship from 'src/database/sponsor/sponsorship/sponsorship.entity';
import moment from 'moment';

@Injectable()
export default class CronService {
  constructor(private scheduler: SchedulerRegistry) {}

  public createSponsorshipPaymentSchedule(
    { sponsorshipId, lastPaymentDate }: Sponsorship,
    lastDateToPayCallback: (...args: any[]) => any,
  ) {
    if (!lastPaymentDate)
      throw new ServerError('Yok ayılma payı bana yok ayılma payı');

    const nextPaymentDate = moment(lastPaymentDate).add(1, 'month').toDate();

    const paymentSchedule = new CronJob(
      nextPaymentDate,
      lastDateToPayCallback,
      null,
      true,
    );

    this.scheduler.addCronJob(sponsorshipId.toString(), paymentSchedule);
  }
}
