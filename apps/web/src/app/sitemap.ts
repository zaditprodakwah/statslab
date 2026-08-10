import { MetadataRoute } from "next";

const MODULE_SLUGS = ["zakat-infak", "perpus-madrasah", "tajwid-juz-30", "wakaf-produktif"];

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://statslabmedia.vercel.app";

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    ...MODULE_SLUGS.map(
      (slug) =>
        ({
          url: `${baseUrl}/module/${slug}`,
          lastModified: new Date(),
          changeFrequency: "weekly" as const,
          priority: 0.8,
        }) as const
    ),
  ];
}
