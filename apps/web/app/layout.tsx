import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'URL Shortener',
  description: 'Сократи свою ссылку',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>
      </body>
    </html>
  );
}