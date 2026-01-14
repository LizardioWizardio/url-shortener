// apps/web/app/not-found.tsx

import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-8">Ссылка не найдена</p>
        <Link
          href="/"
          className="inline-block bg-indigo-600 text-white py-3 px-8 rounded-lg font-semibold hover:bg-indigo-700 transition"
        >
          На главную
        </Link>
      </div>
    </div>
  );
}