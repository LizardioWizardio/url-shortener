// apps/web/app/actions/url.actions.ts

'use server';

import { revalidatePath } from 'next/cache';
import apiClient from '@/lib/api';
import { createUrlSchema } from '@/lib/schemas';

export async function createShortUrl(formData: FormData) {
  const rawData = {
    originalUrl: formData.get('originalUrl'),
    customCode: formData.get('customCode') || undefined,
    title: formData.get('title') || undefined,
  };

  const parsed = createUrlSchema.safeParse(rawData);
  if (!parsed.success) {
    return {
      error: parsed.error.issues[0].message,
    };
  }

  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    console.log('Sending request to API:', parsed.data);
    console.log('API URL:', apiUrl);
    
    const response = await apiClient.post('/urls', parsed.data);
    console.log('API Response:', response.data);
    revalidatePath('/');
    return { 
      success: true, 
      shortCode: response.data.shortCode 
    };
  } catch (error: any) {
    console.error('Full error:', error);
    console.error('Error response:', error.response);
    console.error('Error message:', error.message);
    console.error('API URL attempted:', apiClient.defaults.baseURL);
    
    if (error.code === 'ECONNREFUSED') {
      return {
        error: 'API сервер не запущен. Убедитесь, что API запущен на порту 3000.',
      };
    }
    
    return {
      error: error.response?.data?.message || error.message || 'Ошибка создания ссылки',
    };
  }
}