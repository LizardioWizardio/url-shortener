import { Module } from '@nestjs/common';
import { RedirectController } from './redirect.controller';
import { UrlsModule } from '../urls/urls.module';
import { ClicksModule } from '../clicks/clicks.module';

@Module({
  imports: [UrlsModule, ClicksModule],
  controllers: [RedirectController],
})
export class RedirectModule {}