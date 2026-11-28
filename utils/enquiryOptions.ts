// Shared by the booking form (browser) and the enquiry API (server),
// so the dropdowns and the server-side checks can't drift apart.

export const OCCASIONS = ["Birthday", "Anniversary", "Dinner party", "Date night", "Other"] as const;

export const BUDGETS = ["Under £40", "£40–£60", "£60–£80", "£80–£100", "Over £100", "Not sure yet"] as const;

export const MAX_GUESTS = 30;

// Back of House statuses. Must match the list in firestore.rules.
export const STATUSES = ["New", "Quoted", "Confirmed", "Declined"] as const;

// Privacy notice: enquiries are kept 12 months, then deleted by hand from Back of House.
export const RETENTION_MONTHS = 12;
