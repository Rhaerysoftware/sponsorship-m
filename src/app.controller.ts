import { Controller, Get, Post, Body } from '@nestjs/common';
import { AppService } from 'src/app.service';
import { LoginDto } from 'shared/dtos';

@Controller()
export class AppController {
  constructor(private appService: AppService) {}

  @Post('/')
  async getHello() {
    console.log('App Controller Testing');

    const res = await this.appService.getHello();

    console.log('App Controller Result:', res);

    return { ok: true };
  }
}
