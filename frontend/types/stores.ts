export type Store = {
  id: string; // Unique identifier for the store
  clerkId: string; // Clerk ID associated with the store
  name: string; // Name of the store
  status: "awaiting approval" | "approved" | "rejected"; // Store status, limited to certain values
  description: string | null; // Optional description of the store
  stitchClientKey: string | null; // Optional stitch client key
  city: string | null; // Optional city of the store
  town: string | null; // Optional town of the store
  postalCode: string | null; // Optional postal code
  streetName: string | null; // Optional street name
  streetNumber: string | null; // Optional street number
  stitchClientSecret: string | null; // Optional stitch client secret
};
