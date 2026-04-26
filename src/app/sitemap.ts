import type { MetadataRoute } from "next";
const BASE = "https://ecomrevhub.com";
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: BASE, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${BASE}/privacy`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    { url: `${BASE}/terms`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    { url: `${BASE}/security`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/auth/login`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/auth/register`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
  ];
}
