import { Module, Global } from '@nestjs/common';
import FileService from 'src/services/file/file.service';

@Global()
@Module({
  providers: [FileService],
  exports: [FileService],
})
export default class FileModule {}
