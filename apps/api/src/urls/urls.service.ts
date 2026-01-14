// apps/api/src/urls/urls.service.ts

import { 
    Injectable, 
    NotFoundException, 
    ConflictException,
    BadRequestException,
  } from '@nestjs/common';
  import { PrismaService } from '../../prisma/prisma.service';
  import { ConfigService } from '@nestjs/config';
  import { Inject } from '@nestjs/common';
  import { CACHE_MANAGER } from '@nestjs/cache-manager';
  import type { Cache } from 'cache-manager';
  import { nanoid } from 'nanoid';
  import { CreateUrlDto } from './dto/create-url.dto';
  import { UrlStatus } from '@prisma/client';
  
  @Injectable()
  export class UrlsService {
    private readonly shortCodeLength: number;
    private readonly customCodeMinLength: number;
    private readonly customCodeMaxLength: number;
  
    constructor(
      private readonly prisma: PrismaService,
      private readonly configService: ConfigService,
      //@Inject(CACHE_MANAGER) private cacheManager: Cache,
    ) {
      this.shortCodeLength = this.configService.get<number>('app.shortCodeLength', 7);
      this.customCodeMinLength = this.configService.get<number>('app.customCodeMinLength', 4);
      this.customCodeMaxLength = this.configService.get<number>('app.customCodeMaxLength', 20);
    }
  
    async create(dto: CreateUrlDto) {
      const shortCode = dto.customCode || this.generateShortCode();
  
      const existing = await this.prisma.url.findUnique({
        where: { shortCode },
      });
  
      if (existing) {
        throw new ConflictException('Этот код уже занят');
      }
  
      const url = await this.prisma.url.create({
        data: {
          shortCode,
          originalUrl: dto.originalUrl,
          title: dto.title,
          description: dto.description,
          expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : null,
          maxClicks: dto.maxClicks,
          status: UrlStatus.ACTIVE,
        },
      });
  
      //await this.cacheUrlInRedis(url);
  
      return url;
    }
  
    async findByShortCode(shortCode: string) {
      // const cached = await this.cacheManager.get(`url:${shortCode}`);
      // if (cached) {
      //   return cached;
      // }
  
      const url = await this.prisma.url.findUnique({
        where: { shortCode },
        include: {
          _count: {
            select: { clicks: true },
          },
        },
      });
  
      if (!url) {
        throw new NotFoundException('Ссылка не найдена');
      }
  
      if (url.expiresAt && new Date() > url.expiresAt) {
        throw new BadRequestException('Ссылка истекла');
      }
  
      if (url.maxClicks && url._count.clicks >= url.maxClicks) {
        throw new BadRequestException('Превышен лимит кликов');
      }
  
      if (url.status !== UrlStatus.ACTIVE) {
        throw new BadRequestException('Ссылка неактивна');
      }
  
      //await this.cacheUrlInRedis(url);
  
      return url;
    }
  
    async delete(shortCode: string) {
      const url = await this.prisma.url.findUnique({
        where: { shortCode },
      });
  
      if (!url) {
        throw new NotFoundException('Ссылка не найдена');
      }
  
      await this.prisma.url.delete({
        where: { shortCode },
      });
  
      //await this.cacheManager.del(`url:${shortCode}`);
  
      return { message: 'Ссылка удалена' };
    }
  
    async getClicksByShortCode(shortCode: string) {
      await this.findByShortCode(shortCode);
  
      const clicks = await this.prisma.click.findMany({
        where: { url: { shortCode } },
        orderBy: { clickedAt: 'desc' },
        take: 100,
      });
  
      return clicks;
    }
  
    private generateShortCode(): string {
      return nanoid(this.shortCodeLength);
    }
  
    /*private async cacheUrlInRedis(url: any) {
      const TTL = 3600;
      await this.cacheManager.set(`url:${url.shortCode}`, url, TTL);
    }*/
  }