'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';

type Payment = { id: string; provider: string; plan: string; amount: number; currency: string; status: string; created_at: string };
export default function BillingPage() {
  const { user } = useAuth(); const [payments, setPayments] = useState<Payment[]>([]);
  useEffect(() => { if (user) supabase.from('payments').select('id, provider, plan, amount, currency, status, created_at').order('created_at', { ascending: false }).then(({ data }: { data: Payment[] | null }) => setPayments(data || [])); }, [user]);
  if (!user) return <main className="container" style={{ padding: '5rem 1rem' }}><h1>Billing</h1><p>Sign in to view payments.</p><Link className="btn-primary" href="/login">Sign in</Link></main>;
  return <main className="container" style={{ padding: '5rem 1rem' }}><h1>Billing History</h1><p>Payments may remain pending until the provider confirms them.</p><div style={{ overflowX: 'auto' }}><table style={{ width: '100%', textAlign: 'left' }}><thead><tr><th>Date</th><th>Plan</th><th>Provider</th><th>Amount</th><th>Status</th></tr></thead><tbody>{payments.map((payment) => <tr key={payment.id}><td>{new Date(payment.created_at).toLocaleDateString()}</td><td>{payment.plan}</td><td>{payment.provider}</td><td>{payment.currency} {payment.amount}</td><td>{payment.status}</td></tr>)}</tbody></table></div></main>;
}
