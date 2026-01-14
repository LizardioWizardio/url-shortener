import { UAParser } from 'ua-parser-js';
import { DeviceType } from '@prisma/client';

const BOT_PATTERNS = [
  /bot/i, 
  /crawler/i, 
  /spider/i, 
  /scraper/i,
  /wget/i, 
  /curl/i, 
  /python/i, 
  /googlebot/i,
  /bingbot/i, 
  /facebookexternalhit/i, 
  /twitterbot/i,
  /whatsapp/i,
  /telegram/i,
];

export interface ParsedUA {
  deviceType: DeviceType;
  browser?: string;
  browserVer?: string;
  os?: string;
  osVer?: string;
  isBot: boolean;
  botName?: string;
}

export function parseUserAgent(userAgent: string): ParsedUA {
  if (!userAgent) {
    return {
      deviceType: DeviceType.UNKNOWN,
      isBot: false,
    };
  }

  // Проверка на бота
  const botPattern = BOT_PATTERNS.find(p => p.test(userAgent));
  if (botPattern) {
    const botMatch = userAgent.match(/(\w+bot|\w+spider|\w+crawler)/i);
    return {
      deviceType: DeviceType.BOT,
      isBot: true,
      botName: botMatch?.[0] || 'Unknown Bot',
    };
  }

  // Парсинг обычного UA
  const parser = new UAParser(userAgent);
  const result = parser.getResult();

  return {
    deviceType: determineDeviceType(result),
    browser: result.browser.name,
    browserVer: result.browser.version,
    os: result.os.name,
    osVer: result.os.version,
    isBot: false,
  };
}

function determineDeviceType(result: UAParser.IResult): DeviceType {
  const deviceType = result.device.type;
  
  if (deviceType === 'mobile') return DeviceType.MOBILE;
  if (deviceType === 'tablet') return DeviceType.TABLET;
  if (deviceType === 'smarttv' || deviceType === 'wearable' || deviceType === 'embedded') {
    return DeviceType.UNKNOWN;
  }
  
  return DeviceType.DESKTOP;
}