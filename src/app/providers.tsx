"use client";
import { CleanConnectProvider } from "@/context/CleanConnectContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  return <CleanConnectProvider>{children}</CleanConnectProvider>;
}
