import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

type ProductInput = {
  title: string;
  slug: string;
  category: string;
  price: number;
  description: string;
  downloadUrl: string;
  socialCaption?: string;
};

function client() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Store administration is not configured.');
  return createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
}

async function isAdmin(request: Request) {
  const token = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
  const allowedEmails = (process.env.ADMIN_EMAILS || '').split(',').map((email) => email.trim().toLowerCase()).filter(Boolean);
  if (!token || !allowedEmails.length) return false;
  const { data } = await client().auth.getUser(token);
  return Boolean(data.user?.email && allowedEmails.includes(data.user.email.toLowerCase()));
}

function validate(value: unknown): ProductInput {
  if (!value || typeof value !== 'object') throw new Error('A product payload is required.');
  const data = value as Record<string, unknown>;
  for (const key of ['title', 'slug', 'category', 'description', 'downloadUrl'] as const) {
    if (typeof data[key] !== 'string' || !data[key].trim()) throw new Error(`Invalid ${key}.`);
  }
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(data.slug as string)) throw new Error('Slug must use lowercase letters, numbers, and hyphens.');
  if (typeof data.price !== 'number' || !Number.isFinite(data.price) || data.price < 0 || data.price > 10000) throw new Error('Invalid price.');
  try { const url = new URL(data.downloadUrl as string); if (url.protocol !== 'https:') throw new Error(); } catch { throw new Error('Download URL must be HTTPS.'); }
  return { title: (data.title as string).trim(), slug: data.slug as string, category: (data.category as string).trim(), price: data.price, description: (data.description as string).trim(), downloadUrl: (data.downloadUrl as string).trim(), socialCaption: typeof data.socialCaption === 'string' ? data.socialCaption.trim() : '' };
}

export async function GET(request: Request) {
  try {
    if (!await isAdmin(request)) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    const { data, error } = await client().from('products').select('title, slug, category, price, description, download_url, status, published_at').order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    return NextResponse.json({ products: data ?? [] });
  } catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : 'Unable to load products.' }, { status: 500 }); }
}

export async function POST(request: Request) {
  try {
    if (!await isAdmin(request)) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    const product = validate(await request.json());
    const { error } = await client().from('products').upsert({ title: product.title, slug: product.slug, category: product.category, price: product.price, description: product.description, social_caption: product.socialCaption || `New ${product.title} is now available.`, download_url: product.downloadUrl, status: 'published', published_at: new Date().toISOString(), updated_at: new Date().toISOString() }, { onConflict: 'slug' });
    if (error) throw new Error(error.message);
    return NextResponse.json({ success: true });
  } catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : 'Unable to save product.' }, { status: 400 }); }
}

export async function DELETE(request: Request) {
  try {
    if (!await isAdmin(request)) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    const slug = new URL(request.url).searchParams.get('slug');
    if (!slug) throw new Error('A product slug is required.');
    const { error } = await client().from('products').update({ status: 'archived', updated_at: new Date().toISOString() }).eq('slug', slug);
    if (error) throw new Error(error.message);
    return NextResponse.json({ success: true });
  } catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : 'Unable to archive product.' }, { status: 400 }); }
}
