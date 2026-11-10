"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/lib/supabase";

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
  type?: "individual" | "company";
  rate?: number;
  radius?: number;
  companyNumber?: string;
  autoAccept90?: boolean;
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
  addJob: (j: Omit<Job, "id" | "status" | "postedAt">) => Promise<void>;
  cleaners: Cleaner[];
  addCleaner: (c: Omit<Cleaner, "id" | "registeredAt">) => Promise<void>;
  businesses: Business[];
  addBusiness: (b: Omit<Business, "id" | "registeredAt">) => Promise<void>;
  loading: boolean;
};

const CleanConnectContext = createContext<Ctx | null>(null);

function rowToJob(r: Record<string, unknown>): Job {
  return {
    id: r.id as string,
    rooms: (r.rooms as Job["rooms"]) || [],
    totalRooms: r.total_rooms as number,
    subtotal: r.subtotal as number,
    total: r.total as number,
    email: r.email as string,
    phone: r.phone as string,
    postcode: r.postcode as string,
    city: r.city as string,
    status: r.status as Job["status"],
    postedAt: r.created_at as string,
    conditions: (r.conditions as Record<string, string>) || {},
  };
}

function rowToCleaner(r: Record<string, unknown>): Cleaner {
  return {
    id: r.id as string,
    name: r.name as string,
    email: r.email as string,
    phone: r.phone as string,
    postcode: r.postcode as string,
    city: r.city as string,
    bio: (r.bio as string) || "",
    registeredAt: r.created_at as string,
    type: r.type as "individual" | "company" | undefined,
    rate: r.rate as number | undefined,
    radius: r.radius as number | undefined,
    companyNumber: r.company_number as string | undefined,
    autoAccept90: (r.auto_accept_90 as boolean) || false,
  };
}

function rowToBusiness(r: Record<string, unknown>): Business {
  return {
    id: r.id as string,
    companyName: r.company_name as string,
    companyNumber: r.company_number as string,
    vatNumber: (r.vat_number as string) || "",
    contactName: r.contact_name as string,
    email: r.email as string,
    phone: r.phone as string,
    postcode: r.postcode as string,
    city: r.city as string,
    serviceType: (r.service_type as string) || "",
    registeredAt: r.created_at as string,
  };
}

export function CleanConnectProvider({ children }: { children: ReactNode }) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [cleaners, setCleaners] = useState<Cleaner[]>([]);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [{ data: j }, { data: c }, { data: b }] = await Promise.all([
        supabase.from("jobs").select("*").order("created_at", { ascending: false }),
        supabase.from("cleaners").select("*").order("created_at", { ascending: false }),
        supabase.from("businesses").select("*").order("created_at", { ascending: false }),
      ]);
      if (j) setJobs(j.map((r) => rowToJob(r as Record<string, unknown>)));
      if (c) setCleaners(c.map((r) => rowToCleaner(r as Record<string, unknown>)));
      if (b) setBusinesses(b.map((r) => rowToBusiness(r as Record<string, unknown>)));
      setLoading(false);
    }
    load();
  }, []);

  async function addJob(j: Omit<Job, "id" | "status" | "postedAt">) {
    const { data, error } = await supabase.from("jobs").insert({
      rooms: j.rooms,
      total_rooms: j.totalRooms,
      subtotal: j.subtotal,
      total: j.total,
      email: j.email,
      phone: j.phone,
      postcode: j.postcode,
      city: j.city,
      conditions: j.conditions,
    }).select().single();
    if (!error && data) setJobs((prev) => [rowToJob(data as Record<string, unknown>), ...prev]);
  }

  async function addCleaner(c: Omit<Cleaner, "id" | "registeredAt">) {
    const { data, error } = await supabase.from("cleaners").insert({
      name: c.name,
      email: c.email,
      phone: c.phone,
      postcode: c.postcode,
      city: c.city,
      bio: c.bio,
      type: c.type,
      rate: c.rate,
      radius: c.radius,
      company_number: c.companyNumber,
      auto_accept_90: c.autoAccept90,
    }).select().single();
    if (!error && data) setCleaners((prev) => [rowToCleaner(data as Record<string, unknown>), ...prev]);
  }

  async function addBusiness(b: Omit<Business, "id" | "registeredAt">) {
    const { data, error } = await supabase.from("businesses").insert({
      company_name: b.companyName,
      company_number: b.companyNumber,
      vat_number: b.vatNumber,
      contact_name: b.contactName,
      email: b.email,
      phone: b.phone,
      postcode: b.postcode,
      city: b.city,
      service_type: b.serviceType,
    }).select().single();
    if (!error && data) setBusinesses((prev) => [rowToBusiness(data as Record<string, unknown>), ...prev]);
  }

  return (
    <CleanConnectContext.Provider value={{ jobs, addJob, cleaners, addCleaner, businesses, addBusiness, loading }}>
      {children}
    </CleanConnectContext.Provider>
  );
}

export function useCleanConnect() {
  const ctx = useContext(CleanConnectContext);
  if (!ctx) throw new Error("useCleanConnect must be used inside CleanConnectProvider");
  return ctx;
}
