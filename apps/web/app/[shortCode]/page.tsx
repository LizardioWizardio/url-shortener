import { redirect, notFound } from 'next/navigation';
import apiClient from '@/lib/api';

interface PageProps {
  params: Promise<{ shortCode: string }>;
}

async function getUrlData(shortCode: string) {
  try {
    const response = await apiClient.get(`/urls/${shortCode}`);
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 404) {
      return null;
    }
    throw error;
  }
}

export default async function RedirectPage({ params }: PageProps) {
  const { shortCode } = await params;
  const urlData = await getUrlData(shortCode);

  if (!urlData) {
    notFound();
  }

  // Server-side redirect
  redirect(urlData.originalUrl);
}