import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "EcomRevHub — AI-Powered E-Commerce Growth Engine",
  description: "Build it, launch it, grow it — all in one place. EcomRevHub is your complete e-commerce platform with AI-powered analytics, marketing, store building, and optimization tools.",
  keywords: "ecommerce, AI, dropshipping, store builder, analytics, marketing automation, SEO, ad management",
  openGraph: {
    title: "EcomRevHub — AI-Powered E-Commerce Growth Engine",
    description: "Build it, launch it, grow it — all in one place. Complete AI-powered e-commerce platform.",
    url: "https://ecomrevhub.com",
    siteName: "EcomRevHub",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="noise-overlay">
        {children}
      </body>
    </html>
  );
}
