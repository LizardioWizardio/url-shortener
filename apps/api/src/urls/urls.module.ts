import { Module } from '@nestjs/common';
import { UrlsController } from './urls.controller';
import { UrlsService } from './urls.service';
import { ClicksModule } from '../clicks/clicks.module';

@Module({
  imports: [ClicksModule],
  controllers: [UrlsController],
  providers: [UrlsService],
  exports: [UrlsService],
})
export class UrlsModule {}