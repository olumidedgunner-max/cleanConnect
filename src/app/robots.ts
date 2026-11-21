import { MetadataRoute } from "next";

const SITE = "https://cleanersmarketplace.co.uk";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // /dashboard is per-visitor and /api returns JSON, so neither
        // belongs in an index.
        disallow: ["/api/", "/dashboard"],
      },
    ],
    sitemap: `${SITE}/sitemap.xml`,
    host: SITE,
  };
}
