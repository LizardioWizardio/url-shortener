// apps/web/components/url-form.tsx

'use client';

import { useState, useTransition } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createShortUrl } from '@/app/actions/url.actions';
import { createUrlSchema, type CreateUrlInput } from '@/lib/schemas';
import UrlCard from './url-card';

export default function UrlForm() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<{ shortCode?: string; error?: string } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateUrlInput>({
    resolver: zodResolver(createUrlSchema),
    defaultValues: {
      originalUrl: '',
      customCode: '',
      title: '',
    },
  });

  // Явная типизация SubmitHandler
  const onSubmit: SubmitHandler<CreateUrlInput> = (data) => {
    startTransition(async () => {
      const formData = new FormData();
      formData.append('originalUrl', data.originalUrl);
      if (data.customCode) formData.append('customCode', data.customCode);
      if (data.title) formData.append('title', data.title);

      const res = await createShortUrl(formData);
      setResult(res);

      if (res.success) {
        reset();
      }
    });
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Форма */}
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Создать короткую ссылку
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Original URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Длинная ссылка *
            </label>
            <input
              {...register('originalUrl')}
              type="url"
              placeholder="https://example.com/very/long/url"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
            />
            {errors.originalUrl && (
              <p className="mt-1 text-sm text-red-600">{errors.originalUrl.message}</p>
            )}
          </div>

          {/* Custom Code */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Кастомный код (опционально)
            </label>
            <input
              {...register('customCode')}
              type="text"
              placeholder="my-link"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
            />
            {errors.customCode && (
              <p className="mt-1 text-sm text-red-600">{errors.customCode.message}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              4-20 символов: латиница, цифры, _ и -
            </p>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Название (опционально)
            </label>
            <input
              {...register('title')}
              type="text"
              placeholder="Моя ссылка"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-indigo-700 disabled:bg-gray-400 transition"
          >
            {isPending ? 'Создаём...' : 'Создать ссылку'}
          </button>
        </form>

        {/* Error */}
        {result?.error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">{result.error}</p>
          </div>
        )}
      </div>

      {/* Результат */}
      {result?.shortCode && <UrlCard shortCode={result.shortCode} />}
    </div>
  );
}