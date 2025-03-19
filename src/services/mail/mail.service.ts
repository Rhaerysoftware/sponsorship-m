import { Injectable } from '@nestjs/common';
import { GlobalConfigService } from '../config/config.service';
import * as nodemailer from 'nodemailer';

@Injectable()
export default class MailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: GlobalConfigService) {
    const mailConfig = this.configService.getMailConfig();
    const mailUser = this.configService.getMailUser();

    this.transporter = nodemailer.createTransport({
      ...mailConfig,
      service: 'gmail',
      secure: false,
      auth: {
        user: mailUser.mail,
        pass: mailUser.password,
      },
    });

    this.transporter.addListener('error', this.onMailError);
  }

  private onMailError(error: Error) {
    console.log(error);
  }
}
