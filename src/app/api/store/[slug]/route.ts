import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';

function serviceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Store downloads are not configured.');
  return createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
}

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const token = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
    if (!token) return NextResponse.json({ error: 'Sign in to access this download.' }, { status: 401 });

    const client = serviceClient();
    const { data: userData, error: userError } = await client.auth.getUser(token);
    if (userError || !userData.user?.email) {
      return NextResponse.json({ error: 'Your session is invalid.' }, { status: 401 });
    }

    const { data: product, error: productError } = await client.from('products').select('slug, download_url, status').eq('slug', slug).eq('status', 'published').maybeSingle();
    if (productError || !product) return NextResponse.json({ error: 'Product not found.' }, { status: 404 });

    const { data: matchingPayments, error: paymentsError } = await client.from('payments').select('id').eq('user_id', userData.user.id).in('status', ['completed', 'paid']).limit(1);
    if (paymentsError || !matchingPayments?.length) {
      return NextResponse.json({ error: 'Purchase required to access this download.' }, { status: 403 });
    }

    return NextResponse.json({ downloadUrl: product.download_url, slug: product.slug });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unable to access this download.' }, { status: 400 });
  }
}
