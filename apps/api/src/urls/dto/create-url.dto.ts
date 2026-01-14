import { 
    IsUrl, 
    IsOptional, 
    IsString, 
    MinLength, 
    MaxLength, 
    Matches,
    IsDateString,
    IsInt,
    Min,
  } from 'class-validator';
  
export class CreateUrlDto {
    @IsUrl({}, { message: 'Введите валидный URL' })
    originalUrl: string;

    @IsOptional()
    @IsString()
    @MinLength(4, { message: 'Минимум 4 символа' })
    @MaxLength(20, { message: 'Максимум 20 символов' })
    @Matches(/^[a-zA-Z0-9_-]+$/, { 
        message: 'Только латиница, цифры, _ и -' 
    })
    customCode?: string;

    @IsOptional()
    @IsString()
    @MaxLength(255)
    title?: string;

    @IsOptional()
    @IsString()
    @MaxLength(1000)
    description?: string;

    @IsOptional()
    @IsDateString()
    expiresAt?: string;

    @IsOptional()
    @IsInt()
    @Min(1)
    maxClicks?: number;
}