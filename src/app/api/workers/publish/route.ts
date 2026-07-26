import { timingSafeEqual } from 'crypto';
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

type ProductPayload = {
  title: string; slug: string; category: string; price: number; description: string;
  social_caption: string; downloadUrl: string; promoUrl?: string;
};

function configuredClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Store publishing is not configured.');
  return createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
}

function isAuthorized(request: Request) {
  const expected = process.env.PIPELINE_PUBLISH_SECRET;
  const supplied = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '') ?? '';
  if (!expected || supplied.length !== expected.length) return false;
  return timingSafeEqual(Buffer.from(supplied), Buffer.from(expected));
}

function validate(value: unknown): ProductPayload {
  if (!value || typeof value !== 'object') throw new Error('A JSON product payload is required.');
  const data = value as Record<string, unknown>;
  const strings = ['title', 'slug', 'category', 'description', 'social_caption', 'downloadUrl'] as const;
  for (const key of strings) if (typeof data[key] !== 'string' || !data[key].trim()) throw new Error(`Invalid ${key}.`);
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(data.slug as string)) throw new Error('Slug must use lowercase letters, numbers, and hyphens.');
  if (typeof data.price !== 'number' || !Number.isFinite(data.price) || data.price < 0 || data.price > 10000) throw new Error('Invalid price.');
  if ((data.title as string).length > 140 || (data.description as string).length > 20000 || (data.social_caption as string).length > 2200) throw new Error('Product copy is too long.');
  for (const urlKey of ['downloadUrl', 'promoUrl'] as const) if (data[urlKey] !== undefined) { try { const url = new URL(data[urlKey] as string); if (url.protocol !== 'https:') throw new Error(); } catch { throw new Error(`Invalid ${urlKey}.`); } }
  return data as unknown as ProductPayload;
}

function platformUrl(response: unknown): string | null {
  const post = (response as { post?: { platforms?: Array<{ platformPostUrl?: string }> } })?.post;
  return post?.platforms?.find((item) => item.platformPostUrl)?.platformPostUrl ?? null;
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  try {
    const payload = validate(await request.json());
    const client = configuredClient();
    const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://apexblueskytools.online').replace(/\/$/, '');
    const { data: product, error: productError } = await client.from('products').upsert({
      title: payload.title.trim(), slug: payload.slug, category: payload.category.trim(), price: payload.price,
      description: payload.description.trim(), social_caption: payload.social_caption.trim(), download_url: payload.downloadUrl,
      status: 'published', published_at: new Date().toISOString(), updated_at: new Date().toISOString(),
    }, { onConflict: 'slug' }).select('id, slug').single();
    if (productError || !product) throw new Error(productError?.message || 'Could not publish product.');

    const { data: existing } = await client.from('social_posts').select('status, platform_post_url').eq('product_id', product.id).maybeSingle();
    if (existing?.status === 'published') return NextResponse.json({ success: true, storeUrl: `${siteUrl}/store/${product.slug}`, socialPosted: true, socialUrl: existing.platform_post_url });

    const promoUrl = payload.promoUrl || process.env.DEFAULT_PROMO_VIDEO_URL;
    const apiKey = process.env.ZERNIO_API_KEY;
    const accountId = process.env.ZERNIO_TIKTOK_ACCOUNT_ID;
    if (!apiKey || !accountId || !promoUrl) throw new Error('TikTok publishing is not configured. Set ZERNIO_API_KEY, ZERNIO_TIKTOK_ACCOUNT_ID, and DEFAULT_PROMO_VIDEO_URL.');
    await client.from('social_posts').upsert({ product_id: product.id, status: 'posting', error_message: null }, { onConflict: 'product_id' });
    const caption = `${payload.social_caption.trim()}\n\nDownload: ${siteUrl}/store/${product.slug}`;
    const socialResponse = await fetch('https://zernio.com/api/v1/posts', { method: 'POST', headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json', 'x-request-id': product.id }, body: JSON.stringify({ title: payload.title, content: caption, mediaItems: [{ type: 'video', url: promoUrl, title: payload.title }], platforms: [{ platform: 'tiktok', accountId }], publishNow: true }) });
    const socialBody: unknown = await socialResponse.json().catch(() => ({}));
    if (!socialResponse.ok) {
      const message = (socialBody as { error?: string })?.error || `Zernio request failed (${socialResponse.status}).`;
      await client.from('social_posts').update({ status: 'failed', error_message: message }).eq('product_id', product.id);
      return NextResponse.json({ success: false, productPublished: true, storeUrl: `${siteUrl}/store/${product.slug}`, socialPosted: false, error: message }, { status: 502 });
    }
    const zernioId = (socialBody as { post?: { _id?: string } })?.post?._id ?? null;
    const socialUrl = platformUrl(socialBody);
    await client.from('social_posts').update({ status: 'published', provider_post_id: zernioId, platform_post_url: socialUrl, published_at: new Date().toISOString(), error_message: null }).eq('product_id', product.id);
    return NextResponse.json({ success: true, storeUrl: `${siteUrl}/store/${product.slug}`, socialPosted: true, socialUrl });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Publishing failed.';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
