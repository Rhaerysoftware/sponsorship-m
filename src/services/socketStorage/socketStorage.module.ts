import { Global, Module } from '@nestjs/common';
import SocketStorageService from 'src/services/socketStorage/socketStorage.service';

@Global()
@Module({
  providers: [SocketStorageService],
  exports: [SocketStorageService],
})
export default class SocketStorageModule {}
