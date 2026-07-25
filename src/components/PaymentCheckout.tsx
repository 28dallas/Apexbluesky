'use client';
import { useState } from 'react';
import { CreditCard, Smartphone } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';

export default function PaymentCheckout({ plan = 'pro_monthly' }: { plan?: 'pro_monthly' | 'credits_100' }) {
  const { user } = useAuth(); const [phone, setPhone] = useState(''); const [message, setMessage] = useState(''); const [loading, setLoading] = useState(false);
  const headers = async () => { const { data } = await supabase.auth.getSession(); return { 'Content-Type': 'application/json', Authorization: `Bearer ${data.session?.access_token || ''}` }; };
  const pay = async (provider: 'stripe' | 'mpesa') => {
    if (!user) { window.location.href = '/signup?next=/pricing'; return; }
    setLoading(true); setMessage('');
    const url = provider === 'stripe' ? '/api/payment/stripe/create-session' : '/api/payment/mpesa/initiate';
    const response = await fetch(url, { method: 'POST', headers: await headers(), body: JSON.stringify({ plan, phone }) }); const data = await response.json();
    setLoading(false); if (!response.ok) { setMessage(data.error || 'Could not start payment.'); return; }
    if (data.url) { window.location.assign(data.url); return; }
    setMessage('Check your phone and enter your M-Pesa PIN. This page will show the completed payment in Billing shortly.');
  };
  return <div style={{ display: 'grid', gap: '0.75rem' }}>
    <button className="btn-primary" disabled={loading} onClick={() => pay('stripe')}><CreditCard size={16} /> Pay by card</button>
    <div style={{ display: 'flex', gap: '0.5rem' }}><input aria-label="M-Pesa phone number" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="0712 345 678" style={{ minWidth: 0, flex: 1, padding: '0.7rem' }} /><button className="btn-primary" disabled={loading || !phone} onClick={() => pay('mpesa')} title="Pay with M-Pesa"><Smartphone size={16} /></button></div>
    {message && <p style={{ margin: 0, fontSize: '0.9rem' }}>{message}</p>}
  </div>;
}
