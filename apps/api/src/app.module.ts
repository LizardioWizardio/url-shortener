import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule, ThrottlerModuleOptions } from '@nestjs/throttler';
import configuration from './config/configuration';
import { PrismaModule } from '../prisma/prisma.module';
import { UrlsModule } from './urls/urls.module';
import { ClicksModule } from './clicks/clicks.module';
import { RedirectModule } from './redirect/redirect.module';

@Module({
  imports: [
    // Config
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),

    // Rate Limiting
    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService): ThrottlerModuleOptions => ({
        throttlers: [
          {
            ttl: configService.get('rateLimit.ttl') || 60,
            limit: configService.get('rateLimit.limit') || 10,
          },
        ],
      }),
    }),

    // Modules
    PrismaModule,
    UrlsModule,
    ClicksModule,
    RedirectModule,
  ],
})
export class AppModule {}