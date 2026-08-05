export interface Product {
  id: string;
  title: string;
  category: string;
  image: string;
  price: string;
  originalPrice: string;
  discount: string;
  rating: number;
  salesCount: string;
  badge?: string;
  affiliateUrl: string;
  isFeatured?: boolean;
}

export const AFFILIATE_PRODUCTS: Product[] = [
  {
    id: 'hy300-projector',
    title: 'HY300 4K Smart Mini Projector Android 11 Home Cinema',
    category: 'Audio & Visual',
    image: '/Store/f6bfd5a79993cb10c63d2174d9c52ca0.jpg',
    price: '$59.99',
    originalPrice: '$149.99',
    discount: '-60%',
    rating: 4.8,
    salesCount: '2.4k+ sold',
    badge: '🔥 Top Trending',
    affiliateUrl: 'https://s.click.aliexpress.com/e/_c3mX5Ugr',
    isFeatured: true,
  },
  {
    id: 'hy300-cinema-mode',
    title: 'HY300 Pro — Big Screen Home Cinema Experience up to 120"',
    category: 'Audio & Visual',
    image: '/Store/0a81172ed88441bf4349c5163ecb3c95.jpg',
    price: '$59.99',
    originalPrice: '$149.99',
    discount: '-60%',
    rating: 4.8,
    salesCount: '2.4k+ sold',
    badge: 'Choice',
    affiliateUrl: 'https://s.click.aliexpress.com/e/_c3mX5Ugr',
  },
  {
    id: 'hy300-android11',
    title: 'HY300 Smart Projector — Android 11, Netflix & YouTube Built-in',
    category: 'Audio & Visual',
    image: '/Store/10f1f460c94bdbe4db231060eee1ba22.jpg',
    price: '$59.99',
    originalPrice: '$149.99',
    discount: '-60%',
    rating: 4.8,
    salesCount: '2.4k+ sold',
    affiliateUrl: 'https://s.click.aliexpress.com/e/_c3mX5Ugr',
  },
  {
    id: 'hy300-portable',
    title: 'HY300 Mini Projector — Compact & Portable, Use Anywhere',
    category: 'Audio & Visual',
    image: '/Store/24deb76c4cd2864adaa06d4bceb86ff9.jpg',
    price: '$59.99',
    originalPrice: '$149.99',
    discount: '-60%',
    rating: 4.8,
    salesCount: '2.4k+ sold',
    affiliateUrl: 'https://s.click.aliexpress.com/e/_c3mX5Ugr',
  },
  {
    id: 'hy300-4k-decode',
    title: 'HY300 4K Decoding Projector — Dual WiFi & Bluetooth 5.0',
    category: 'Audio & Visual',
    image: '/Store/41a852de9723df6e6eda83ec84657517.jpg',
    price: '$59.99',
    originalPrice: '$149.99',
    discount: '-60%',
    rating: 4.8,
    salesCount: '2.4k+ sold',
    badge: 'Top Rated',
    affiliateUrl: 'https://s.click.aliexpress.com/e/_c3mX5Ugr',
  },
  {
    id: 'hy300-gaming',
    title: 'HY300 Projector — Low Latency Gaming & Sports Mode',
    category: 'Audio & Visual',
    image: '/Store/7fe04a4efb030149b8d59b2b1ab5f490.jpg',
    price: '$59.99',
    originalPrice: '$149.99',
    discount: '-60%',
    rating: 4.8,
    salesCount: '2.4k+ sold',
    affiliateUrl: 'https://s.click.aliexpress.com/e/_c3mX5Ugr',
  },
  {
    id: 'hy300-bedroom',
    title: 'HY300 Projector — 180° Flip, Perfect for Bedroom Ceiling Projection',
    category: 'Audio & Visual',
    image: '/Store/87c744121dac6db120892c4cb95c7230.jpg',
    price: '$59.99',
    originalPrice: '$149.99',
    discount: '-60%',
    rating: 4.8,
    salesCount: '2.4k+ sold',
    affiliateUrl: 'https://s.click.aliexpress.com/e/_c3mX5Ugr',
  },
];

// Legacy export kept for any existing imports
export type StoreProduct = {
  title: string;
  slug?: string;
  service: string;
  price: string;
  badge: string;
  description: string;
  features: string[];
};
export const storeProducts: StoreProduct[] = [];
