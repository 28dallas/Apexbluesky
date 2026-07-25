import { createClient } from '@supabase/supabase-js';

export type PlanId = 'pro_monthly' | 'credits_100';

type Plan = {
  id: PlanId;
  amount: number;
  currency: 'KES';
  credits: number;
  premiumDays: number;
  stripePriceId?: string;
};

const planValues: Record<PlanId, Plan> = {
  pro_monthly: { id: 'pro_monthly', amount: Number(process.env.MPESA_PRO_AMOUNT_KES || 999), currency: 'KES', credits: 0, premiumDays: 30, stripePriceId: process.env.STRIPE_PRO_MONTHLY_PRICE_ID },
  credits_100: { id: 'credits_100', amount: Number(process.env.MPESA_CREDITS_100_AMOUNT_KES || 100), currency: 'KES', credits: 100, premiumDays: 0, stripePriceId: process.env.STRIPE_CREDITS_100_PRICE_ID },
};

export function getPlan(value: unknown): Plan | null {
  return typeof value === 'string' && value in planValues ? planValues[value as PlanId] : null;
}

function serviceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Billing is not configured.');
  return createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
}

export async function requireUser(request: Request) {
  const token = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
  if (!token) throw new Error('Sign in to continue.');
  const { data, error } = await serviceClient().auth.getUser(token);
  if (error || !data.user) throw new Error('Your session has expired. Please sign in again.');
  return data.user;
}

export async function consumeCredits(request: Request, cost: number) {
  const token = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
  const user = await requireUser(request);
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!token || !url || !key) throw new Error('Billing is not configured.');
  const client = createClient(url, key, { global: { headers: { Authorization: `Bearer ${token}` } }, auth: { autoRefreshToken: false, persistSession: false } });
  const { data, error } = await client.rpc('consume_credits', { p_cost: cost });
  if (error || !data) throw new Error('You do not have enough credits.');
  return user;
}

export async function createPendingPayment(userId: string, provider: 'mpesa' | 'stripe', plan: Plan, providerTransactionId?: string) {
  const { data, error } = await serviceClient().from('payments').insert({
    user_id: userId, provider, provider_transaction_id: providerTransactionId ?? null,
    amount: plan.amount, currency: plan.currency, status: 'pending', plan: plan.id,
    credits_awarded: plan.credits, premium_days: plan.premiumDays,
  }).select('id').single();
  if (error || !data) throw new Error('Could not create payment record.');
  return data.id as string;
}

export async function markPaymentFailed(paymentId: string) {
  await serviceClient().from('payments').update({ status: 'failed' }).eq('id', paymentId).eq('status', 'pending');
}

export async function fulfillPayment(paymentId: string, providerTransactionId: string) {
  const { data, error } = await serviceClient().rpc('complete_payment', { p_payment_id: paymentId, p_provider_transaction_id: providerTransactionId });
  if (error || !data) throw new Error('Could not activate this payment.');
}

export async function paymentForUser(paymentId: string, userId: string) {
  const { data, error } = await serviceClient().from('payments').select('id, status, plan, amount, currency, created_at, completed_at').eq('id', paymentId).eq('user_id', userId).single();
  if (error || !data) throw new Error('Payment not found.');
  return data;
}
