import { MetadataRoute } from 'next';
import toolsData from '@/data/tools.json';
import { SITE_URL } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
    const staticRoutes: MetadataRoute.Sitemap = [
        { url: SITE_URL,                        lastModified: new Date(), changeFrequency: 'daily',   priority: 1.0 },
        { url: `${SITE_URL}/about`,             lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
        { url: `${SITE_URL}/contact`,           lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
        { url: `${SITE_URL}/pricing`,           lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
        { url: `${SITE_URL}/privacy`,           lastModified: new Date(), changeFrequency: 'yearly',  priority: 0.3 },
        { url: `${SITE_URL}/disclosure`,        lastModified: new Date(), changeFrequency: 'yearly',  priority: 0.3 },
    ];

    const toolRoutes: MetadataRoute.Sitemap = Object.keys(toolsData).map((id) => ({
        url: `${SITE_URL}/tools/${id}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.9,
    }));

    return [...staticRoutes, ...toolRoutes];
}
