function normalizeSiteUrl(url: string): string {
  const trimmed = (url || '').trim();
  if (!trimmed) return 'https://apexblueskytools.online';
  const noTrailingSlash = trimmed.endsWith('/') ? trimmed.slice(0, -1) : trimmed;
  // If a user sets SITE_URL without scheme, assume https.
  if (!/^https?:\/\//i.test(noTrailingSlash)) return `https://${noTrailingSlash}`;
  return noTrailingSlash;
}

// Server-side can read SITE_URL; client-side should use NEXT_PUBLIC_SITE_URL.
export const SITE_URL = normalizeSiteUrl(
  process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || 'https://apexblueskytools.online',
);

