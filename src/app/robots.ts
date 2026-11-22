import { MetadataRoute } from "next";

const SITE = "https://cleanersmarketplace.co.uk";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // None of these belong in search results: /api returns JSON,
        // /dashboard and /admin are behind the admin login. Keeping the
        // sign-in page out of the index also keeps it off the radar of
        // the bots that trawl for login forms to guess at.
        disallow: ["/api/", "/dashboard", "/admin"],
      },
    ],
    sitemap: `${SITE}/sitemap.xml`,
    host: SITE,
  };
}
