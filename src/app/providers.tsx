"use client";
import { MarketplaceProvider } from "@/context/MarketplaceContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  return <MarketplaceProvider>{children}</MarketplaceProvider>;
}
