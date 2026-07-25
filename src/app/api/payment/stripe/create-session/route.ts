import { NextResponse } from 'next/server';
import { createPendingPayment, getPlan, requireUser } from '@/lib/server/billing';

export async function POST(request: Request) {
  try {
    const user = await requireUser(request);
    const plan = getPlan((await request.json()).plan);
    if (!plan?.stripePriceId) return NextResponse.json({ error: 'Card payments are not configured for this plan.' }, { status: 503 });
    const origin = process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin;
    const body = new URLSearchParams({ mode: 'payment', 'line_items[0][price]': plan.stripePriceId, 'line_items[0][quantity]': '1', success_url: `${origin}/billing?stripe_session_id={CHECKOUT_SESSION_ID}`, cancel_url: `${origin}/pricing?cancelled=1`, 'metadata[user_id]': user.id, 'metadata[plan]': plan.id });
    const response = await fetch('https://api.stripe.com/v1/checkout/sessions', { method: 'POST', headers: { Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`, 'Content-Type': 'application/x-www-form-urlencoded' }, body });
    const session = await response.json();
    if (!response.ok || !session.id || !session.url) throw new Error(session.error?.message || 'Could not start card checkout.');
    await createPendingPayment(user.id, 'stripe', plan, session.id);
    return NextResponse.json({ url: session.url });
  } catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : 'Could not start checkout.' }, { status: 400 }); }
}
