import { MetadataRoute } from "next";

const SITE = "https://cleanersmarketplace.co.uk";

// Only the public, stable pages. Job and cleaner detail routes are
// omitted: they are per-record and there are no records to list yet.
const PAGES: { path: string; priority: number; changeFrequency: "daily" | "weekly" | "monthly" }[] = [
  { path: "/", priority: 1.0, changeFrequency: "daily" },
  { path: "/cleaners", priority: 0.9, changeFrequency: "daily" },
  { path: "/post-job", priority: 0.9, changeFrequency: "weekly" },
  { path: "/register-cleaner", priority: 0.8, changeFrequency: "weekly" },
  { path: "/register-individual", priority: 0.7, changeFrequency: "weekly" },
  { path: "/register-business", priority: 0.7, changeFrequency: "weekly" },
  { path: "/support", priority: 0.5, changeFrequency: "monthly" },
  { path: "/terms", priority: 0.3, changeFrequency: "monthly" },
  { path: "/privacy", priority: 0.3, changeFrequency: "monthly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return PAGES.map(({ path, priority, changeFrequency }) => ({
    url: `${SITE}${path}`,
    lastModified,
    changeFrequency,
    priority,
  }));
}
