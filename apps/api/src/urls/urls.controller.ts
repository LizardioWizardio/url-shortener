import { 
    Controller, 
    Get, 
    Post, 
    Delete, 
    Body, 
    Param, 
    HttpCode,
    HttpStatus,
    UseInterceptors,
    ClassSerializerInterceptor,
} from '@nestjs/common';
import { UrlsService } from './urls.service';
import { CreateUrlDto } from './dto/create-url.dto';
import { UrlResponseDto } from './dto/url-response.dto';
import { Url } from '@prisma/client';

function toUrlResponse(url: Url & { _count?: { clicks: number } }): UrlResponseDto {
return new UrlResponseDto({
    id: url.id,
    shortCode: url.shortCode,
    originalUrl: url.originalUrl,
    status: url.status,
    createdAt: url.createdAt,
    updatedAt: url.updatedAt,
    title: url.title ?? undefined,
    description: url.description ?? undefined,
    expiresAt: url.expiresAt ?? undefined,
    maxClicks: url.maxClicks ?? undefined,
    clickCount: url._count?.clicks,
});
}

@Controller('urls')
@UseInterceptors(ClassSerializerInterceptor)
export class UrlsController {
    constructor(private readonly urlsService: UrlsService) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async create(@Body() dto: CreateUrlDto) {
        const url = await this.urlsService.create(dto);
        return toUrlResponse(url);
    }

    @Get(':shortCode')
    async findOne(@Param('shortCode') shortCode: string) {
        const url = await this.urlsService.findByShortCode(shortCode);
        return toUrlResponse(url);
    }

    @Delete(':shortCode')
    @HttpCode(HttpStatus.OK)
    async delete(@Param('shortCode') shortCode: string) {
        return this.urlsService.delete(shortCode);
    }

    @Get(':shortCode/clicks')
    async getClicks(@Param('shortCode') shortCode: string) {
        return this.urlsService.getClicksByShortCode(shortCode);
    }
}