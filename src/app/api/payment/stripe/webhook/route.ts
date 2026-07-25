import { createHmac, timingSafeEqual } from 'crypto';
import { NextResponse } from 'next/server';
import { fulfillPayment } from '@/lib/server/billing';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  const raw = await request.text(); const signature = request.headers.get('stripe-signature') || ''; const secret = process.env.STRIPE_WEBHOOK_SECRET || '';
  const timestamp = signature.match(/t=(\d+)/)?.[1]; const supplied = signature.match(/v1=([^,]+)/)?.[1];
  const expected = timestamp ? createHmac('sha256', secret).update(`${timestamp}.${raw}`).digest('hex') : '';
  if (!supplied || !expected || supplied.length !== expected.length || !timingSafeEqual(Buffer.from(supplied), Buffer.from(expected))) return NextResponse.json({ error: 'Invalid signature.' }, { status: 400 });
  const event = JSON.parse(raw);
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const client = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
    const { data } = await client.from('payments').select('id').eq('provider', 'stripe').eq('provider_transaction_id', session.id).single();
    if (data) await fulfillPayment(data.id, session.payment_intent || session.id);
  }
  return NextResponse.json({ received: true });
}
