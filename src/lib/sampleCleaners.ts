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
};

export const SAMPLE_CLEANERS: SampleCleaner[] = [
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
  },
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
  },
  {
    id: "c3",
    name: "Sparkle Pro Clean Ltd",
    type: "company",
    city: "Manchester",
    postcode: "M1 1AE",
    rate: 30,
    radius: 20,
    bio: "Fully insured commercial and domestic cleaning company. Team of 6 cleaners. Specialists in deep cleans, end-of-tenancy, and office cleaning.",
    rating: 4.8,
    jobsCompleted: 182,
    registeredAt: "2026-01-15T08:00:00Z",
    companyNumber: "13456789",
  },
  {
    id: "c4",
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
  },
  {
    id: "c5",
    name: "Clean & Shine Services",
    type: "company",
    city: "London",
    postcode: "SW1A 1AA",
    rate: 25,
    radius: 20,
    bio: "Award-winning cleaning company covering all of Greater London. Verified team, fully insured, same-day availability for urgent cleans.",
    rating: 4.6,
    jobsCompleted: 340,
    registeredAt: "2025-11-10T11:00:00Z",
    companyNumber: "09876543",
  },
  {
    id: "c6",
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
  },
];
