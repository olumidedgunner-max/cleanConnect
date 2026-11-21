import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "CleanersMarketplace — Find Work. Find Cleaners. Connect.",
    short_name: "CleanersMarketplace",
    description: "Connecting cleaning professionals with people and businesses that need cleaning services. Post a job and get a fair price from your room photos in seconds.",
    start_url: "/",
    display: "standalone",
    orientation: "portrait-primary",
    background_color: "#07111f",
    theme_color: "#1ea7ff",
    categories: ["lifestyle", "productivity", "business"],
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icons/icon-maskable.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    screenshots: [
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    shortcuts: [
      { name: "Post a Job", short_name: "Post Job", description: "Post a new cleaning job", url: "/post-job", icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }] },
      { name: "Find Cleaners", short_name: "Cleaners", description: "Browse cleaners in your area", url: "/cleaners", icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }] },
      { name: "Dashboard", short_name: "Dashboard", description: "View your jobs and cleaners", url: "/dashboard", icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }] },
    ],
  };
}
