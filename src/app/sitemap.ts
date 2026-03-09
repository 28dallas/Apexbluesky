import { MetadataRoute } from 'next';
import toolsData from '@/data/tools.json';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://www.apexbluesky.com';

    const staticRoutes: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: `${baseUrl}/about`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/contact`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.5,
        },
        {
            url: `${baseUrl}/privacy`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.3,
        },
    ];

    const dynamicRoutes: MetadataRoute.Sitemap = Object.keys(toolsData).map((id) => ({
        url: `${baseUrl}/tools/${id}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.9,
    }));

    return [...staticRoutes, ...dynamicRoutes];
}
