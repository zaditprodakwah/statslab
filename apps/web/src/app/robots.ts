import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://statslabmedia.vercel.app'
  
  return {
    rules: [
      {
        // Standard Search Engines (Google, Bing, etc.)
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/', '/private/'],
      },
      {
        // AI Crawlers & Answer Engines (GEO/AEO Optimization)
        // We explicitly allow them so StatsLab can be cited as a source
        userAgent: ['GPTBot', 'ChatGPT-User', 'Google-Extended', 'Anthropic-ai', 'PerplexityBot', 'CCBot'],
        allow: ['/', '/module/'],
        disallow: ['/api/'],
        crawlDelay: 2, // Prevent server overload from aggressive AI scraping
      }
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  }
}
