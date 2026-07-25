import { NextResponse } from 'next/server';
import { createPendingPayment, getPlan, markPaymentFailed, requireUser } from '@/lib/server/billing';

const baseUrl = () => process.env.MPESA_ENVIRONMENT === 'production' ? 'https://api.safaricom.co.ke' : 'https://sandbox.safaricom.co.ke';
const normalizePhone = (value: string) => value.replace(/\D/g, '').replace(/^0/, '254').replace(/^\+/, '');
async function token() { const auth = Buffer.from(`${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`).toString('base64'); const r = await fetch(`${baseUrl()}/oauth/v1/generate?grant_type=client_credentials`, { headers: { Authorization: `Basic ${auth}` } }); const d = await r.json(); if (!r.ok) throw new Error('Could not authenticate with M-Pesa.'); return d.access_token as string; }

export async function POST(request: Request) {
  let paymentId = '';
  try {
    const user = await requireUser(request); const body = await request.json(); const plan = getPlan(body.plan); const phone = normalizePhone(String(body.phone || ''));
    if (!plan || !/^254\d{9}$/.test(phone)) throw new Error('Enter a valid Kenyan mobile number.');
    const callback = process.env.MPESA_CALLBACK_URL; const shortcode = process.env.MPESA_SHORTCODE; const passkey = process.env.MPESA_PASSKEY;
    if (!callback || !shortcode || !passkey) throw new Error('M-Pesa is not configured.');
    paymentId = await createPendingPayment(user.id, 'mpesa', plan);
    const timestamp = new Date().toISOString().replace(/[-:TZ.]/g, '').slice(0, 14); const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString('base64');
    const response = await fetch(`${baseUrl()}/mpesa/stkpush/v1/processrequest`, { method: 'POST', headers: { Authorization: `Bearer ${await token()}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ BusinessShortCode: shortcode, Password: password, Timestamp: timestamp, TransactionType: 'CustomerPayBillOnline', Amount: plan.amount, PartyA: phone, PartyB: shortcode, PhoneNumber: phone, CallBackURL: callback, AccountReference: paymentId, TransactionDesc: `ApexBlueSky ${plan.id}` }) });
    const result = await response.json(); if (!response.ok || !result.CheckoutRequestID) throw new Error(result.errorMessage || 'M-Pesa could not start the payment.');
    const { createClient } = await import('@supabase/supabase-js'); const client = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
    await client.from('payments').update({ provider_transaction_id: result.CheckoutRequestID }).eq('id', paymentId);
    return NextResponse.json({ paymentId, checkoutRequestId: result.CheckoutRequestID });
  } catch (error) { if (paymentId) await markPaymentFailed(paymentId); return NextResponse.json({ error: error instanceof Error ? error.message : 'Could not start M-Pesa payment.' }, { status: 400 }); }
}
