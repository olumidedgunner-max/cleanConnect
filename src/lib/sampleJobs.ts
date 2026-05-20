export type SampleRoom = { type: string; condition: "none" | "moderate" | "medium"; rate: number };

export type SampleJob = {
  id: string;
  title: string;
  rooms: SampleRoom[];
  city: string;
  postcode: string;
  subtotal: number;
  total: number;
  status: "awaiting" | "accepted" | "completed";
  postedAt: string;
};

export const SAMPLE_JOBS: SampleJob[] = [
  {
    id: "s1",
    title: "3-Bed House Clean",
    city: "London",
    postcode: "SE1 7PB",
    status: "awaiting",
    postedAt: "2026-05-19T10:00:00Z",
    rooms: [
      { type: "Bedroom", condition: "moderate", rate: 20 },
      { type: "Bedroom", condition: "moderate", rate: 20 },
      { type: "Bedroom", condition: "moderate", rate: 20 },
      { type: "Kitchen", condition: "moderate", rate: 20 },
      { type: "Living Room", condition: "moderate", rate: 20 },
      { type: "Toilet / Bathroom", condition: "moderate", rate: 20 },
      { type: "Toilet / Bathroom", condition: "moderate", rate: 20 },
    ],
    subtotal: 140,
    total: 147,
  },
  {
    id: "s2",
    title: "Airbnb Turnover",
    city: "Manchester",
    postcode: "M1 1AE",
    status: "awaiting",
    postedAt: "2026-05-19T14:30:00Z",
    rooms: [
      { type: "Bedroom", condition: "medium", rate: 25 },
      { type: "Kitchen", condition: "medium", rate: 25 },
      { type: "Living Room", condition: "medium", rate: 25 },
      { type: "Toilet / Bathroom", condition: "medium", rate: 25 },
    ],
    subtotal: 100,
    total: 105,
  },
  {
    id: "s3",
    title: "Student Flat Clean",
    city: "Birmingham",
    postcode: "B1 1BB",
    status: "awaiting",
    postedAt: "2026-05-20T09:00:00Z",
    rooms: [
      { type: "Bedroom", condition: "none", rate: 30 },
      { type: "Bedroom", condition: "none", rate: 30 },
      { type: "Kitchen", condition: "none", rate: 30 },
      { type: "Toilet / Bathroom", condition: "none", rate: 30 },
    ],
    subtotal: 120,
    total: 126,
  },
];
