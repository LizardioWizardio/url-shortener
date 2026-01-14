import { 
    Controller, 
    Get, 
    Param, 
    Res, 
    Headers,
    HttpStatus,
  } from '@nestjs/common';
  import type { FastifyReply } from 'fastify';
  import { UrlsService } from '../urls/urls.service';
  import { ClicksService } from '../clicks/clicks.service';
  import { ClientIp } from '../common/decorators/client-ip.decorator';
  import type { Url } from '@prisma/client';
  
  @Controller()
  export class RedirectController {
    constructor(
      private readonly urlsService: UrlsService,
      private readonly clicksService: ClicksService,
    ) {}
  
    @Get(':shortCode')
    async redirect(
      @Param('shortCode') shortCode: string,
      @ClientIp() ip: string,
      @Headers('user-agent') userAgent: string,
      @Headers('referer') referer: string,
      @Res() reply: FastifyReply,
    ) {
      // Получаем URL
      const url = await this.urlsService.findByShortCode(shortCode) as Url;
  
      // Записываем клик асинхронно (не блокируем редирект)
      this.clicksService
        .recordClick(url.id, ip, userAgent || '', referer)
        .catch(err => console.error('Failed to record click:', err));
  
      // Редирект
      return reply
        .status(HttpStatus.MOVED_PERMANENTLY)
        .header('Location', url.originalUrl)
        .send();
    }
  }