import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://statslabmedia.vercel.app'

  // Dalam produksi, kita bisa mengambil dari database atau list statis modul dataset
  const modules = ['zakat', 'wakaf', 'tajwid', 'perpus']

  const moduleUrls = modules.map((slug) => ({
    url: `${baseUrl}/module/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  return [
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
      priority: 0.5,
    },
    ...moduleUrls,
  ]
}
