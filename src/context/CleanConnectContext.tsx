"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Job = {
  id: string;
  rooms: { type: string; count: number }[];
  totalRooms: number;
  subtotal: number;
  total: number;
  email: string;
  phone: string;
  postcode: string;
  city: string;
  status: "awaiting" | "accepted" | "completed";
  postedAt: string;
  conditions: Record<string, string>;
};

export type Cleaner = {
  id: string;
  name: string;
  email: string;
  phone: string;
  postcode: string;
  city: string;
  bio: string;
  registeredAt: string;
};

export type Business = {
  id: string;
  companyName: string;
  companyNumber: string;
  vatNumber: string;
  contactName: string;
  email: string;
  phone: string;
  postcode: string;
  city: string;
  serviceType: string;
  registeredAt: string;
};

type Ctx = {
  jobs: Job[];
  addJob: (j: Omit<Job, "id" | "status" | "postedAt">) => void;
  cleaners: Cleaner[];
  addCleaner: (c: Omit<Cleaner, "id" | "registeredAt">) => void;
  businesses: Business[];
  addBusiness: (b: Omit<Business, "id" | "registeredAt">) => void;
};

const CleanConnectContext = createContext<Ctx | null>(null);

export function CleanConnectProvider({ children }: { children: ReactNode }) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [cleaners, setCleaners] = useState<Cleaner[]>([]);
  const [businesses, setBusinesses] = useState<Business[]>([]);

  useEffect(() => {
    try {
      const j = localStorage.getItem("cc_jobs");
      const c = localStorage.getItem("cc_cleaners");
      const b = localStorage.getItem("cc_businesses");
      if (j) setJobs(JSON.parse(j));
      if (c) setCleaners(JSON.parse(c));
      if (b) setBusinesses(JSON.parse(b));
    } catch {}
  }, []);

  function addJob(j: Omit<Job, "id" | "status" | "postedAt">) {
    const newJob: Job = { ...j, id: Date.now().toString(), status: "awaiting", postedAt: new Date().toISOString() };
    setJobs((prev) => {
      const updated = [newJob, ...prev];
      localStorage.setItem("cc_jobs", JSON.stringify(updated));
      return updated;
    });
  }

  function addCleaner(c: Omit<Cleaner, "id" | "registeredAt">) {
    const newCleaner: Cleaner = { ...c, id: Date.now().toString(), registeredAt: new Date().toISOString() };
    setCleaners((prev) => {
      const updated = [newCleaner, ...prev];
      localStorage.setItem("cc_cleaners", JSON.stringify(updated));
      return updated;
    });
  }

  function addBusiness(b: Omit<Business, "id" | "registeredAt">) {
    const newBusiness: Business = { ...b, id: Date.now().toString(), registeredAt: new Date().toISOString() };
    setBusinesses((prev) => {
      const updated = [newBusiness, ...prev];
      localStorage.setItem("cc_businesses", JSON.stringify(updated));
      return updated;
    });
  }

  return (
    <CleanConnectContext.Provider value={{ jobs, addJob, cleaners, addCleaner, businesses, addBusiness }}>
      {children}
    </CleanConnectContext.Provider>
  );
}

export function useCleanConnect() {
  const ctx = useContext(CleanConnectContext);
  if (!ctx) throw new Error("useCleanConnect must be used inside CleanConnectProvider");
  return ctx;
}
