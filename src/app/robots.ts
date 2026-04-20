import { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: [
                    '/api/',
                    '/auth/',
                    '/login',
                    '/signup',
                    '/forgot',
                    '/reset-password',
                ],
            },
            // Block AI training crawlers (2026 best practice)
            {
                userAgent: ['GPTBot', 'Google-Extended', 'CCBot', 'anthropic-ai'],
                disallow: '/',
            },
        ],
        sitemap: `${SITE_URL}/sitemap.xml`,
        host: SITE_URL,
    };
}
