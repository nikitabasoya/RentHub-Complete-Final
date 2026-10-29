export interface AppUser {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'renter' | 'landlord';
}
export interface Listing {
  id: string;
  title: string;
  propertyType: string;
  buildingName: string;
  shared: boolean;
  address: string;
  city: string;
  state: string;
  zip: string;
  area: number;
  bedrooms: number;
  bathrooms: number;
  rent: number;
  priceMode: 'monthly' | 'utilities-included';
  negotiable: boolean;
  leaseType: 'long-term' | 'short-term' | 'both';
  furnished: boolean;
  vegetarianPreference: 'yes' | 'no' | 'no-preference';
  amenities: string[];
  description: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  photos: string[];
  ownerId: string;
  ownerName: string;
  createdAt: string;
}
export interface ListingComment {
  id: string;
  listingId: string;
  userId: string;
  userName: string;
  message: string;
  parentId: string | null;
  createdAt: string;
}
