'use client';

import { useState } from 'react';
import { copyToClipboard } from '@/lib/utils';
import Link from 'next/link';

interface UrlCardProps {
  shortCode: string;
}

export default function UrlCard({ shortCode }: UrlCardProps) {
  const [copied, setCopied] = useState(false);

  const shortUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/${shortCode}`;

  const handleCopy = () => {
    copyToClipboard(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl shadow-xl p-8 text-white">
      <h2 className="text-2xl font-bold mb-4">✅ Ссылка создана!</h2>

      <div className="bg-white/10 backdrop-blur rounded-lg p-4 mb-4">
        <p className="text-sm opacity-90 mb-2">Короткая ссылка:</p>
        <p className="text-xl font-mono break-all">{shortUrl}</p>
      </div>

      <div className="flex gap-3">
        <button
          onClick={handleCopy}
          className="flex-1 bg-white text-indigo-600 py-3 px-6 rounded-lg font-semibold hover:bg-gray-100 transition"
        >
          {copied ? '✓ Скопировано' : 'Копировать'}
        </button>

        <Link
          href={`/analytics/${shortCode}`}
          className="flex-1 bg-white/20 backdrop-blur py-3 px-6 rounded-lg font-semibold hover:bg-white/30 transition text-center"
        >
          Аналитика
        </Link>
      </div>
    </div>
  );
}