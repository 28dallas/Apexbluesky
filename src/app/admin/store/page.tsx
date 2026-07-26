'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';

type Product = {
  title: string; slug: string; category: string; price: number; description: string;
  download_url: string; status: 'draft' | 'published' | 'archived';
};

const emptyDraft = { title: '', slug: '', category: 'Web Templates', price: '', description: '', downloadUrl: '', socialCaption: '' };

export default function StoreAdminPage() {
  const { session, isLoading } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [draft, setDraft] = useState(emptyDraft);
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  const headers = () => ({ Authorization: `Bearer ${session?.access_token || ''}`, 'Content-Type': 'application/json' });
  const load = async () => {
    if (!session?.access_token) return;
    const response = await fetch('/api/admin/products', { headers: headers() });
    const data = await response.json();
    if (response.ok) setProducts(data.products);
    else setMessage(data.error || 'You do not have access to store administration.');
  };

  useEffect(() => { void load(); }, [session?.access_token]); // eslint-disable-line react-hooks/exhaustive-deps

  const save = async (event: React.FormEvent) => {
    event.preventDefault(); setBusy(true); setMessage('');
    const response = await fetch('/api/admin/products', { method: 'POST', headers: headers(), body: JSON.stringify({ ...draft, price: Number(draft.price) }) });
    const data = await response.json(); setBusy(false);
    if (!response.ok) return setMessage(data.error || 'Could not save the product.');
    setDraft(emptyDraft); setMessage('Product published.'); void load();
  };

  const archive = async (slug: string) => {
    setBusy(true); setMessage('');
    const response = await fetch(`/api/admin/products?slug=${encodeURIComponent(slug)}`, { method: 'DELETE', headers: headers() });
    const data = await response.json(); setBusy(false);
    if (!response.ok) return setMessage(data.error || 'Could not archive the product.');
    setMessage('Product archived.'); void load();
  };

  if (isLoading) return <main style={pageStyle}>Loading…</main>;
  if (!session) return <main style={pageStyle}>Sign in with an address in <code>ADMIN_EMAILS</code> to manage products.</main>;

  return <main style={pageStyle}><div style={{ maxWidth: 1000, margin: '0 auto' }}>
    <p style={eyebrowStyle}>Store administration</p><h1>Publish a digital product</h1>
    <p style={{ color: '#cbd5e1' }}>Changes are stored in Supabase. Archiving hides a product from the public store without deleting it.</p>
    {message && <p role="status" style={{ color: message.includes('published') || message.includes('archived') ? '#86efac' : '#fca5a5' }}>{message}</p>}
    <form onSubmit={save} style={panelStyle}>
      <input required value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} placeholder="Product title" style={inputStyle} />
      <input required pattern="[a-z0-9]+(-[a-z0-9]+)*" value={draft.slug} onChange={(e) => setDraft({ ...draft, slug: e.target.value })} placeholder="product-slug" style={inputStyle} />
      <input required value={draft.category} onChange={(e) => setDraft({ ...draft, category: e.target.value })} placeholder="Category" style={inputStyle} />
      <input required min="0" max="10000" step="0.01" type="number" value={draft.price} onChange={(e) => setDraft({ ...draft, price: e.target.value })} placeholder="Price (USD)" style={inputStyle} />
      <input required type="url" value={draft.downloadUrl} onChange={(e) => setDraft({ ...draft, downloadUrl: e.target.value })} placeholder="HTTPS download URL" style={inputStyle} />
      <textarea required rows={4} value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} placeholder="Product description" style={inputStyle} />
      <textarea rows={3} value={draft.socialCaption} onChange={(e) => setDraft({ ...draft, socialCaption: e.target.value })} placeholder="Optional social caption" style={inputStyle} />
      <button disabled={busy} style={buttonStyle}>{busy ? 'Saving…' : 'Publish product'}</button>
    </form>
    <section style={{ marginTop: 32 }}><h2>Products</h2><div style={{ display: 'grid', gap: 12 }}>{products.map((product) => <article key={product.slug} style={panelStyle}><div><strong>{product.title}</strong><p style={{ color: '#cbd5e1' }}>{product.category} · ${product.price.toFixed(2)} · {product.status}</p></div>{product.status !== 'archived' && <button disabled={busy} onClick={() => void archive(product.slug)} style={archiveStyle}>Archive</button>}</article>)}</div></section>
  </div></main>;
}

const pageStyle: React.CSSProperties = { minHeight: '100vh', background: '#0b0f1a', color: '#f8fafc', padding: '48px 20px' };
const panelStyle: React.CSSProperties = { display: 'grid', gap: 12, padding: 20, borderRadius: 18, background: 'rgba(15,23,42,.8)', border: '1px solid rgba(255,255,255,.1)' };
const inputStyle: React.CSSProperties = { width: '100%', boxSizing: 'border-box', padding: '12px 14px', borderRadius: 10, border: '1px solid rgba(255,255,255,.15)', background: '#111827', color: '#fff' };
const buttonStyle: React.CSSProperties = { width: 'fit-content', padding: '10px 16px', border: 0, borderRadius: 999, background: '#818cf8', color: '#fff', cursor: 'pointer', fontWeight: 700 };
const archiveStyle: React.CSSProperties = { ...buttonStyle, background: '#7f1d1d' };
const eyebrowStyle: React.CSSProperties = { color: '#a5b4fc', fontSize: 13, fontWeight: 800, letterSpacing: '.14em', textTransform: 'uppercase' };
