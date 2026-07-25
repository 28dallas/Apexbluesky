import { NextResponse } from 'next/server';
import { paymentForUser, requireUser } from '@/lib/server/billing';
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try { const user = await requireUser(request); return NextResponse.json(await paymentForUser((await params).id, user.id)); }
  catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : 'Payment not found.' }, { status: 404 }); }
}
