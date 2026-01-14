-- CreateEnum
CREATE TYPE "UrlStatus" AS ENUM ('ACTIVE', 'EXPIRED', 'DELETED');

-- CreateEnum
CREATE TYPE "DeviceType" AS ENUM ('DESKTOP', 'MOBILE', 'TABLET', 'BOT', 'UNKNOWN');

-- CreateTable
CREATE TABLE "urls" (
    "id" TEXT NOT NULL,
    "shortCode" VARCHAR(20) NOT NULL,
    "originalUrl" TEXT NOT NULL,
    "title" VARCHAR(255),
    "description" TEXT,
    "status" "UrlStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "expiresAt" TIMESTAMP(3),
    "maxClicks" INTEGER,

    CONSTRAINT "urls_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clicks" (
    "id" TEXT NOT NULL,
    "urlId" TEXT NOT NULL,
    "clickedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ip" INET NOT NULL,
    "userAgent" TEXT NOT NULL,
    "deviceType" "DeviceType" NOT NULL DEFAULT 'UNKNOWN',
    "browser" VARCHAR(50),
    "browserVer" VARCHAR(20),
    "os" VARCHAR(50),
    "osVer" VARCHAR(20),
    "referer" TEXT,
    "isBot" BOOLEAN NOT NULL DEFAULT false,
    "botName" VARCHAR(100),

    CONSTRAINT "clicks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "urls_shortCode_key" ON "urls"("shortCode");

-- CreateIndex
CREATE INDEX "urls_status_createdAt_idx" ON "urls"("status", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "urls_createdAt_idx" ON "urls"("createdAt" DESC);

-- CreateIndex
CREATE INDEX "urls_expiresAt_idx" ON "urls"("expiresAt");

-- CreateIndex
CREATE INDEX "clicks_urlId_clickedAt_idx" ON "clicks"("urlId", "clickedAt" DESC);

-- CreateIndex
CREATE INDEX "clicks_clickedAt_idx" ON "clicks"("clickedAt" DESC);

-- CreateIndex
CREATE INDEX "clicks_urlId_deviceType_idx" ON "clicks"("urlId", "deviceType");

-- CreateIndex
CREATE INDEX "clicks_urlId_browser_idx" ON "clicks"("urlId", "browser");

-- CreateIndex
CREATE INDEX "clicks_isBot_idx" ON "clicks"("isBot");

-- AddForeignKey
ALTER TABLE "clicks" ADD CONSTRAINT "clicks_urlId_fkey" FOREIGN KEY ("urlId") REFERENCES "urls"("id") ON DELETE CASCADE ON UPDATE CASCADE;
