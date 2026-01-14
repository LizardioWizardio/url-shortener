export default () => ({
    port: parseInt(process.env.API_PORT || '3000', 10),
    nodeEnv: process.env.API_NODE_ENV || 'development',
    
    database: {
      url: process.env.DATABASE_URL,
    },
    
    redis: {
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379', 10),
      password: process.env.REDIS_PASSWORD || undefined,
      db: parseInt(process.env.REDIS_DB || '0', 10),
    },
    
    app: {
      allowedOrigins: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3001'],
      shortCodeLength: parseInt(process.env.SHORT_CODE_LENGTH || '7', 10),
      customCodeMinLength: parseInt(process.env.CUSTOM_CODE_MIN_LENGTH || '4', 10),
      customCodeMaxLength: parseInt(process.env.CUSTOM_CODE_MAX_LENGTH || '20', 10),
    },
    
    rateLimit: {
      ttl: parseInt(process.env.RATE_LIMIT_TTL || '60', 10),
      limit: parseInt(process.env.RATE_LIMIT_MAX || '10', 10),
    },
});