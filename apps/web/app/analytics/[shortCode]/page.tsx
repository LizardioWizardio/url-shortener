// apps/web/app/analytics/[shortCode]/page.tsx

import { notFound } from 'next/navigation';
import Link from 'next/link';
import apiClient from '@/lib/api';
import { formatDate } from '@/lib/utils';

interface PageProps {
  params: Promise<{ shortCode: string }>;
}

async function getAnalytics(shortCode: string) {
  try {
    const [urlResponse, clicksResponse] = await Promise.all([
      apiClient.get(`/urls/${shortCode}`),
      apiClient.get(`/urls/${shortCode}/clicks`),
    ]);
    return {
      url: urlResponse.data,
      clicks: clicksResponse.data,
    };
  } catch (error: any) {
    if (error.response?.status === 404) {
      return null;
    }
    throw error;
  }
}

export default async function AnalyticsPage({ params }: PageProps) {
  const { shortCode } = await params;
  const data = await getAnalytics(shortCode);

  if (!data) {
    notFound();
  }

  const { url, clicks } = data;
  const shortUrl = `${process.env.NEXT_PUBLIC_API_URL}/${shortCode}`;

  // Группировка по устройствам
  const deviceStats = clicks.reduce((acc: any, click: any) => {
    const device = click.deviceType || 'UNKNOWN';
    acc[device] = (acc[device] || 0) + 1;
    return acc;
  }, {});

  // Группировка по браузерам
  const browserStats = clicks.reduce((acc: any, click: any) => {
    const browser = click.browser || 'Unknown';
    acc[browser] = (acc[browser] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Аналитика</h1>
        <Link
          href="/"
          className="text-indigo-600 hover:text-indigo-800 font-semibold"
        >
          ← Создать новую
        </Link>
      </div>

      {/* URL Info */}
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-500">Короткая ссылка</p>
            <p className="text-xl font-mono text-indigo-600">{shortUrl}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Оригинальная ссылка</p>
            <p className="text-lg break-all">{url.originalUrl}</p>
          </div>
          {url.title && (
            <div>
              <p className="text-sm text-gray-500">Название</p>
              <p className="text-lg">{url.title}</p>
            </div>
          )}
          <div className="flex gap-8">
            <div>
              <p className="text-sm text-gray-500">Создано</p>
              <p className="text-lg">{formatDate(url.createdAt)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Статус</p>
              <p className="text-lg">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    url.status === 'ACTIVE'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {url.status}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-xl p-6 text-white">
          <p className="text-lg opacity-90 mb-2">Всего кликов</p>
          <p className="text-5xl font-bold">{clicks.length}</p>
        </div>

        <div className="bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl shadow-xl p-6 text-white">
          <p className="text-lg opacity-90 mb-2">Уникальных IP</p>
          <p className="text-5xl font-bold">
            {new Set(clicks.map((c: any) => c.ip)).size}
          </p>
        </div>

        <div className="bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl shadow-xl p-6 text-white">
          <p className="text-lg opacity-90 mb-2">Боты</p>
          <p className="text-5xl font-bold">
            {clicks.filter((c: any) => c.isBot).length}
          </p>
        </div>
      </div>

      {/* Device Stats */}
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">По устройствам</h2>
        <div className="space-y-3">
          {Object.entries(deviceStats).map(([device, count]: [string, any]) => (
            <div key={device} className="flex items-center justify-between">
              <span className="text-lg font-medium">{device}</span>
              <span className="text-2xl font-bold text-indigo-600">{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Browser Stats */}
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">По браузерам</h2>
        <div className="space-y-3">
          {Object.entries(browserStats).map(([browser, count]: [string, any]) => (
            <div key={browser} className="flex items-center justify-between">
              <span className="text-lg font-medium">{browser}</span>
              <span className="text-2xl font-bold text-indigo-600">{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Clicks */}
      {clicks.length > 0 && (
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Последние клики
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Дата</th>
                  <th className="text-left py-3 px-4">IP</th>
                  <th className="text-left py-3 px-4">Устройство</th>
                  <th className="text-left py-3 px-4">Браузер</th>
                  <th className="text-left py-3 px-4">Бот</th>
                </tr>
              </thead>
              <tbody>
                {clicks.slice(0, 10).map((click: any) => (
                  <tr key={click.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm">
                      {formatDate(click.clickedAt)}
                    </td>
                    <td className="py-3 px-4 text-sm font-mono">{click.ip}</td>
                    <td className="py-3 px-4 text-sm">{click.deviceType}</td>
                    <td className="py-3 px-4 text-sm">{click.browser || '-'}</td>
                    <td className="py-3 px-4">
                      {click.isBot ? (
                        <span className="text-red-600">✓</span>
                      ) : (
                        <span className="text-gray-300">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}