export type SampleCleaner = {
  id: string;
  name: string;
  type: "individual" | "company";
  city: string;
  postcode: string;
  rate: number;
  radius: number;
  bio: string;
  rating: number;
  jobsCompleted: number;
  registeredAt: string;
  companyNumber?: string;
  email?: string;
  autoAccept90?: boolean;
};

// --- Individual Cleaners (2) ---
// --- Cleaning Companies (2) ---
// --- Service Providers: 1 business + 2 individual (shown separately on dashboard) ---

export const SAMPLE_CLEANERS: SampleCleaner[] = [

  // Individual cleaner 1
  {
    id: "c1",
    name: "Sarah Mitchell",
    type: "individual",
    city: "London",
    postcode: "SE1 7PB",
    rate: 20,
    radius: 20,
    bio: "Reliable and detail-oriented cleaner. Available weekdays and weekends. Experienced with deep cleans, move-outs, and regular domestic cleaning.",
    rating: 4.9,
    jobsCompleted: 47,
    registeredAt: "2026-03-12T10:00:00Z",
    email: "sarah.mitchell@gmail.com",
    autoAccept90: true,
  },

  // Individual cleaner 2
  {
    id: "c2",
    name: "James Okafor",
    type: "individual",
    city: "London",
    postcode: "E1 6RF",
    rate: 25,
    radius: 15,
    bio: "Student cleaner, flexible hours. Excellent reviews for kitchen and bathroom cleaning. Available evenings and weekends.",
    rating: 4.7,
    jobsCompleted: 23,
    registeredAt: "2026-04-02T09:00:00Z",
    email: "james.okafor@yahoo.com",
    autoAccept90: false,
  },

  // Cleaning company 1
  {
    id: "c3",
    name: "Sparkle Pro Clean Ltd",
    type: "company",
    city: "Manchester",
    postcode: "M1 1AE",
    rate: 30,
    radius: 30,
    bio: "Fully insured commercial and domestic cleaning company. Team of 6 cleaners. Specialists in deep cleans, end-of-tenancy, and office cleaning.",
    rating: 4.8,
    jobsCompleted: 182,
    registeredAt: "2026-01-15T08:00:00Z",
    companyNumber: "13456789",
    email: "ops@sparkleclean.co.uk",
    autoAccept90: true,
  },

  // Cleaning company 2
  {
    id: "c4",
    name: "Clean & Shine Services Ltd",
    type: "company",
    city: "London",
    postcode: "SW1A 1AA",
    rate: 28,
    radius: 25,
    bio: "Award-winning cleaning company covering Greater London. Verified team, fully insured, same-day availability for urgent cleans.",
    rating: 4.6,
    jobsCompleted: 340,
    registeredAt: "2025-11-10T11:00:00Z",
    companyNumber: "09876543",
    email: "hello@cleanandshine.co.uk",
    autoAccept90: false,
  },

  // Service provider — business (company that provides services)
  {
    id: "sp1",
    name: "PrimeServ Facilities Ltd",
    type: "company",
    city: "Birmingham",
    postcode: "B2 4QA",
    rate: 32,
    radius: 40,
    bio: "Commercial facilities management company offering contract cleaning for offices, retail, and hospitality. Fully insured, SIA-registered staff.",
    rating: 4.9,
    jobsCompleted: 510,
    registeredAt: "2025-09-01T08:00:00Z",
    companyNumber: "07654321",
    email: "contracts@primeserv.co.uk",
    autoAccept90: true,
  },

  // Service provider — individual 1
  {
    id: "sp2",
    name: "Priya Sharma",
    type: "individual",
    city: "Birmingham",
    postcode: "B1 1BB",
    rate: 20,
    radius: 10,
    bio: "Part-time cleaner, 3 years experience. Specialises in family homes with children and pets. Eco-friendly products on request.",
    rating: 5.0,
    jobsCompleted: 31,
    registeredAt: "2026-02-20T14:00:00Z",
    email: "priya.sharma@hotmail.com",
    autoAccept90: true,
  },

  // Service provider — individual 2
  {
    id: "sp3",
    name: "Tom Bradley",
    type: "individual",
    city: "Leeds",
    postcode: "LS1 1BA",
    rate: 20,
    radius: 20,
    bio: "University student, thorough and punctual. Great for student flats and shared houses. Reasonable rates with room for negotiation.",
    rating: 4.5,
    jobsCompleted: 12,
    registeredAt: "2026-05-01T16:00:00Z",
    email: "tom.bradley@gmail.com",
    autoAccept90: false,
  },
];
