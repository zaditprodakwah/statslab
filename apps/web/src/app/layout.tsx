import type { Metadata, Viewport } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

// Using Inter for readable text, Outfit for premium headers
const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });
const outfit = Outfit({ subsets: ["latin"], variable: '--font-outfit' });

export const viewport: Viewport = {
  themeColor: '#ffffff',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: "StatsLab | Dasbor Statistika Islami",
  description: "Media Pembelajaran Statistika Interaktif Terintegrasi Nilai Keislaman untuk Memfasilitasi Literasi Data Siswa.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://statslabmedia.vercel.app'),
  authors: [{ name: "Muhammad Khoiruzzadittaqwa" }],
  publisher: "STAI Al-Bahjah",
  robots: {
    index: true,
    follow: true,
    "max-snippet": -1,
    "max-image-preview": "large",
    "max-video-preview": -1,
  },
  openGraph: {
    title: "StatsLab | Dasbor Statistika Islami",
    description: "Media Pembelajaran Statistika Interaktif Terintegrasi Nilai Keislaman.",
    url: "/",
    siteName: "StatsLab",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "StatsLab OpenGraph Image",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "StatsLab | Dasbor Statistika Islami",
    description: "Media Pembelajaran Statistika Interaktif Terintegrasi Nilai Keislaman.",
    images: ["/opengraph-image.png"],
  },
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  // JSON-LD Schema for Organization & SoftwareApplication
  const schemaOrg = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "StatsLab",
    "operatingSystem": "Web",
    "applicationCategory": "EducationalApplication",
    "description": "Media Pembelajaran Statistika Interaktif Terintegrasi Nilai Keislaman untuk Memfasilitasi Literasi Data Siswa.",
    "url": "https://statslabmedia.vercel.app",
    "author": {
      "@type": "Person",
      "name": "Muhammad Khoiruzzadittaqwa",
      "url": "https://scholar.google.com/citations?user=CbR250MAAAAJ"
    },
    "sponsor": {
      "@type": "CollegeOrUniversity",
      "name": "STAI Al-Bahjah Cirebon",
      "url": "https://staialbahjah.ac.id/",
      "logo": "https://statslabmedia.vercel.app/logo-institut.jpg"
    },
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "IDR"
    }
  };

  return (
    <html lang="id">
      <body className={`${inter.variable} ${outfit.variable}`}>
        {/* Inject Schema.org markup for Rich Snippets (AEO/GEO optimization) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrg) }}
        />
        <div className="noise-overlay" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
