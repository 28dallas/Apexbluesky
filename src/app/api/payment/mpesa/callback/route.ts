import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { fulfillPayment } from '@/lib/server/billing';

export async function POST(request: Request) {
  try {
    const callback = (await request.json())?.Body?.stkCallback; const checkoutId = callback?.CheckoutRequestID;
    if (!checkoutId) return NextResponse.json({ ResultCode: 0, ResultDesc: 'Accepted' });
    const client = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
    const { data: payment } = await client.from('payments').select('id, status').eq('provider', 'mpesa').eq('provider_transaction_id', checkoutId).single();
    if (payment && payment.status === 'pending' && callback.ResultCode === 0) await fulfillPayment(payment.id, checkoutId);
    if (payment && callback.ResultCode !== 0) await client.from('payments').update({ status: 'failed' }).eq('id', payment.id).eq('status', 'pending');
  } catch (error) { console.error('M-Pesa callback error', error); }
  return NextResponse.json({ ResultCode: 0, ResultDesc: 'Accepted' });
}
