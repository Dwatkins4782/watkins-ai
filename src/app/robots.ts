import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/auth/", "/api/", "/dashboard/", "/_next/"] },
    ],
    sitemap: "https://ecomrevhub.com/sitemap.xml",
    host: "https://ecomrevhub.com",
  };
}
