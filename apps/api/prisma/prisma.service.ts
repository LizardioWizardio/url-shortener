import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

@Injectable()
export class PrismaService 
    extends PrismaClient 
    implements OnModuleInit, OnModuleDestroy 
{
    constructor(private readonly configService: ConfigService) {
        const isProduction = configService.get('nodeEnv') === 'production';
        const adapter = new PrismaPg({ connectionString: configService.get('database.url') });
        super({
            log: isProduction 
                ? ['error', 'warn']  // Меньше логов на проде
                : ['query', 'info', 'warn', 'error'],  // Все логи в dev
          
            errorFormat: 'pretty',
            adapter,
        });
      }
    
    async onModuleInit() {
        await this.$connect();
    }

    async onModuleDestroy() {
        await this.$disconnect();
    }
}