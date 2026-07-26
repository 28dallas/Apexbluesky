This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Server-Side Processing (Vercel)

Some tools can optionally run via Next.js API routes (useful for Vercel deployments):

- `Merge PDF`, `Split PDF`, `Compress PDF`, `PDF to Word` (text-only DOCX) have server routes under `src/app/api/tools/*`.
- `PDF to JPG` and `MP4 to MP3` server routes return `501` on Vercel; use the browser-based converters for those.

Enable server processing from the browser UI by setting:

```bash
NEXT_PUBLIC_USE_SERVER_PROCESSING=1
```

## Automated product pipeline

The daily workflow in `.github/workflows/daily-product-pipeline.yml` researches a developer topic, generates a product with Groq, packages it, uploads it to Cloudflare R2, then publishes it through the protected API route.

Before enabling it, apply `supabase/migrations/002_store_products_and_social_posts.sql` in Supabase and add these GitHub repository secrets: `GROQ_API_KEY`, `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME`, `PUBLIC_R2_DOMAIN`, `PIPELINE_PUBLISH_SECRET`, and `NEXTJS_PUBLISH_URL`. Add the matching server-side values, plus `SUPABASE_SERVICE_ROLE_KEY`, `ZERNIO_API_KEY`, `ZERNIO_TIKTOK_ACCOUNT_ID`, and `DEFAULT_PROMO_VIDEO_URL`, to your deployment environment. Use `.env.example` as the complete reference; never commit real credentials.

To run the pipeline locally after configuring those values:

```bash
pip install -r automation/requirements.txt
python automation/pipeline_runner.py
```

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
