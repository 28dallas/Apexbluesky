import { createClient } from '@supabase/supabase-js';

export type PublishedProduct = {
  title: string; slug: string; category: string; price: number; description: string; download_url: string;
};

function publicClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return url && key ? createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } }) : null;
}

export async function publishedProducts(): Promise<PublishedProduct[]> {
  const client = publicClient();
  if (!client) return [];
  const { data } = await client.from('products').select('title, slug, category, price, description, download_url').eq('status', 'published').order('published_at', { ascending: false });
  return (data ?? []) as PublishedProduct[];
}

export async function publishedProduct(slug: string): Promise<PublishedProduct | null> {
  const client = publicClient();
  if (!client) return null;
  const { data } = await client.from('products').select('title, slug, category, price, description, download_url').eq('status', 'published').eq('slug', slug).maybeSingle();
  return data as PublishedProduct | null;
}
