import { Expose } from 'class-transformer';

export class UrlResponseDto {
    @Expose()
    id: string;

    @Expose()
    shortCode: string;

    @Expose()
    originalUrl: string;

    @Expose()
    title?: string;

    @Expose()
    description?: string;

    @Expose()
    status: string;

    @Expose()
    createdAt: Date;

    @Expose()
    updatedAt: Date;

    @Expose()
    expiresAt?: Date;

    @Expose()
    maxClicks?: number;

    @Expose()
    clickCount?: number;

    constructor(partial: Partial<UrlResponseDto>) {
        Object.assign(this, partial);
    }
}