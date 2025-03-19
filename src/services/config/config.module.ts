import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GlobalConfigService } from './config.service';

@Global()
@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  providers: [GlobalConfigService],
  exports: [GlobalConfigService],
})
export default class GlobalConfigModule {}
