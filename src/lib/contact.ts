// Single source of truth for the public-facing contact address.
//
// Used in the footer, support page, terms and privacy policy — including
// as the contact point for UK GDPR access and deletion requests, so it
// must be an address that is actually monitored.
//
// Override per environment with NEXT_PUBLIC_CONTACT_EMAIL if needed.
export const CONTACT_EMAIL =
  process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "info@cleanersmarketplace.co.uk";
