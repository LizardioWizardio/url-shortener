// apps/api/src/clicks/clicks.service.ts

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { parseUserAgent, type ParsedUA } from '../common/utils/ua-parser.util';

@Injectable()
export class ClicksService {
  constructor(private readonly prisma: PrismaService) {}

  async recordClick(
    urlId: string,
    ip: string,
    userAgent: string,
    referer?: string,
  ) {
    const parsedUA: ParsedUA = parseUserAgent(userAgent);

    const click = await this.prisma.click.create({
      data: {
        urlId,
        ip,
        userAgent,
        deviceType: parsedUA.deviceType,
        browser: parsedUA.browser,
        browserVer: parsedUA.browserVer,
        os: parsedUA.os,
        osVer: parsedUA.osVer,
        isBot: parsedUA.isBot,
        botName: parsedUA.botName,
        referer,
      },
    });

    return click;
  }
}