import type { Metadata } from "next";
import "./globals.css";
import { CookieConsent } from "@/components/CookieConsent";

const SITE_URL = "https://ecomrevhub.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "EcomRevHub — AI-Powered E-Commerce Growth Engine",
    template: "%s | EcomRevHub",
  },
  description:
    "Build it, launch it, grow it — all in one place. EcomRevHub is your complete e-commerce platform with AI-powered analytics, marketing, store building, and optimization tools.",
  keywords: [
    "ecommerce",
    "AI",
    "dropshipping",
    "store builder",
    "analytics",
    "marketing automation",
    "SEO",
    "ad management",
    "shopify alternative",
    "AI agents",
  ],
  authors: [{ name: "EcomRevHub" }],
  creator: "EcomRevHub",
  publisher: "EcomRevHub",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "EcomRevHub — AI-Powered E-Commerce Growth Engine",
    description:
      "Build it, launch it, grow it — all in one place. Complete AI-powered e-commerce platform.",
    url: SITE_URL,
    siteName: "EcomRevHub",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "EcomRevHub — AI-Powered E-Commerce Growth Engine",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "EcomRevHub — AI-Powered E-Commerce Growth Engine",
    description: "Build, launch, and grow your store with AI agents.",
    images: ["/og-image.png"],
    creator: "@ecomrevhub",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
  },
};

// AUDIT #27: JSON-LD structured data (SoftwareApplication + Organization)
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      name: "EcomRevHub",
      url: SITE_URL,
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      description:
        "AI-powered e-commerce growth engine. Build, launch, and scale your store with autonomous AI agents.",
      offers: [
        { "@type": "Offer", name: "Starter", price: "99", priceCurrency: "USD" },
        { "@type": "Offer", name: "Growth", price: "279", priceCurrency: "USD" },
        { "@type": "Offer", name: "Professional", price: "577", priceCurrency: "USD" },
        { "@type": "Offer", name: "Enterprise", price: "1497", priceCurrency: "USD" },
      ],
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.9",
        ratingCount: "12",
        bestRating: "5",
      },
    },
    {
      "@type": "Organization",
      name: "EcomRevHub",
      url: SITE_URL,
      logo: `${SITE_URL}/og-image.png`,
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer support",
        email: "support@ecomrevhub.com",
        availableLanguage: ["English"],
      },
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="noise-overlay">
        {children}
        <CookieConsent />
      </body>
    </html>
  );
}
