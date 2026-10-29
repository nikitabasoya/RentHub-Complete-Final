import { Injectable, signal } from '@angular/core';
import { Listing, ListingComment } from '../models';
import { StorageService } from './storage.service';

const LISTINGS_KEY = 'renthub.listings';
const FAVOURITES_KEY = 'renthub.favourites';
const COMMENTS_KEY = 'renthub.comments';

const SEED_LISTINGS: Listing[] = [
  {
    id:'seed-1', title:'Sunlit apartment with a city view', propertyType:'Apartment', buildingName:'The Olive Residences',
    shared:false,address:'42 Park Street',city:'Bengaluru',state:'Karnataka',zip:'560001',area:1180,bedrooms:2,bathrooms:2,rent:28000,
    priceMode:'monthly',negotiable:true,leaseType:'long-term',furnished:true,vegetarianPreference:'no-preference',
    amenities:['Power Backup','Car Park','Elevator','Water Heater'],description:'A bright, thoughtfully designed apartment with generous natural light, a practical layout and easy access to cafés, transit and everyday essentials.',
    contactName:'Aarav Mehta',contactEmail:'aarav@example.com',contactPhone:'9876543210',
    photos:['https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80','https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80'],
    ownerId:'demo-owner',ownerName:'Aarav Mehta',createdAt:'2026-10-20T10:00:00.000Z'
  },
  {
    id:'seed-2',title:'Minimal studio near the park',propertyType:'Studio',buildingName:'Greenline Homes',
    shared:false,address:'18 Lake Road',city:'Pune',state:'Maharashtra',zip:'411001',area:620,bedrooms:1,bathrooms:1,rent:16500,
    priceMode:'utilities-included',negotiable:false,leaseType:'both',furnished:true,vegetarianPreference:'no-preference',
    amenities:['Gym/Fitness Center','Laundry Service','Elevator'],description:'A calm studio in a well-maintained building. Furnished interiors, included utilities and a leafy park just around the corner make everyday living easy.',
    contactName:'Diya Shah',contactEmail:'diya@example.com',contactPhone:'9876543211',
    photos:['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80'],
    ownerId:'demo-owner-2',ownerName:'Diya Shah',createdAt:'2026-10-18T10:00:00.000Z'
  },
  {
    id:'seed-3',title:'Spacious family home with balcony',propertyType:'Apartment',buildingName:'Maple Court',
    shared:true,address:'7 Residency Avenue',city:'Hyderabad',state:'Telangana',zip:'500001',area:1450,bedrooms:3,bathrooms:2,rent:35000,
    priceMode:'monthly',negotiable:true,leaseType:'long-term',furnished:false,vegetarianPreference:'no',
    amenities:['Swimming Pool','Visitors Parking','Private Lawn','Club House'],description:'Room to spread out, a breezy balcony and shared community facilities. Ideal for tenants looking for a comfortable long-term home.',
    contactName:'Kabir Rao',contactEmail:'kabir@example.com',contactPhone:'9876543212',
    photos:['https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1200&q=80'],
    ownerId:'demo-owner-3',ownerName:'Kabir Rao',createdAt:'2026-10-16T10:00:00.000Z'
  },
  {
    id:'seed-4',title:'Warm, furnished home for easy living',propertyType:'Apartment',buildingName:'Cedar Heights',
    shared:false,address:'91 Garden Lane',city:'Delhi',state:'Delhi',zip:'110001',area:980,bedrooms:2,bathrooms:1,rent:24000,
    priceMode:'monthly',negotiable:false,leaseType:'short-term',furnished:true,vegetarianPreference:'yes',
    amenities:['Power Backup','Garbage Disposal','Water Heater','Car Park'],description:'Move-in-ready interiors and a convenient neighbourhood. The listing includes clear rental terms and a responsive point of contact.',
    contactName:'Isha Kapoor',contactEmail:'isha@example.com',contactPhone:'9876543213',
    photos:['https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80'],
    ownerId:'demo-owner-4',ownerName:'Isha Kapoor',createdAt:'2026-10-12T10:00:00.000Z'
  },
  {
    id:'seed-5',title:'Quiet apartment with modern finishes',propertyType:'Apartment',buildingName:'The Fern',
    shared:false,address:'5 Hill View Road',city:'Jaipur',state:'Rajasthan',zip:'302001',area:1050,bedrooms:2,bathrooms:2,rent:21000,
    priceMode:'monthly',negotiable:true,leaseType:'both',furnished:false,vegetarianPreference:'no-preference',
    amenities:['Plant Security System','Elevator','Visitors Parking'],description:'A practical home with modern finishes, secure access and nearby shops. A good option for professionals or a small family.',
    contactName:'Rohan Sethi',contactEmail:'rohan@example.com',contactPhone:'9876543214',
    photos:['https://images.unsplash.com/photo-1600607687644-c7171b42498f?auto=format&fit=crop&w=1200&q=80'],
    ownerId:'demo-owner-5',ownerName:'Rohan Sethi',createdAt:'2026-10-10T10:00:00.000Z'
  },
  {
    id:'seed-6',title:'Compact city home close to transit',propertyType:'Studio',buildingName:'Metro Nest',
    shared:true,address:'12 Station Road',city:'Noida',state:'Uttar Pradesh',zip:'201301',area:540,bedrooms:1,bathrooms:1,rent:12500,
    priceMode:'monthly',negotiable:true,leaseType:'short-term',furnished:true,vegetarianPreference:'no-preference',
    amenities:['Laundry Service','Car Park','Power Backup'],description:'An efficient layout for city living with public transport, groceries and daily conveniences within easy reach.',
    contactName:'Anaya Verma',contactEmail:'anaya@example.com',contactPhone:'9876543215',
    photos:['https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1200&q=80'],
    ownerId:'demo-owner-6',ownerName:'Anaya Verma',createdAt:'2026-10-08T10:00:00.000Z'
  }
];
@Injectable({ providedIn: 'root' })
export class ListingService {
  private listingSignal = signal<Listing[]>(this.loadListings());
  readonly listings = this.listingSignal.asReadonly();
  private favouritesSignal = signal<string[]>(this.storage.get<string[]>(FAVOURITES_KEY, []));
  readonly favourites = this.favouritesSignal.asReadonly();
  private commentsSignal = signal<ListingComment[]>(this.storage.get<ListingComment[]>(COMMENTS_KEY, []));
  readonly comments = this.commentsSignal.asReadonly();

  constructor(private storage: StorageService) {}
  private loadListings(): Listing[] {
    const saved = this.storage.get<Listing[] | null>(LISTINGS_KEY, null);
    if (saved && saved.length) return saved;
    this.storage.set(LISTINGS_KEY, SEED_LISTINGS);
    return SEED_LISTINGS;
  }
  private persistListings(value: Listing[]): void { this.listingSignal.set(value); this.storage.set(LISTINGS_KEY, value); }
  toggleFavourite(listingId: string): void {
    const current = this.favouritesSignal();
    const next = current.includes(listingId) ? current.filter(id => id !== listingId) : [...current, listingId];
    this.favouritesSignal.set(next); this.storage.set(FAVOURITES_KEY, next);
  }
  isFavourite(id: string): boolean { return this.favouritesSignal().includes(id); }
  save(listing: Listing): void {
    const exists = this.listingSignal().some(item => item.id === listing.id);
    this.persistListings(exists ? this.listingSignal().map(item => item.id === listing.id ? listing : item) : [listing, ...this.listingSignal()]);
  }
  delete(id: string): void {
    this.persistListings(this.listingSignal().filter(item => item.id !== id));
    this.commentsSignal.update(items => items.filter(item => item.listingId !== id));
    this.storage.set(COMMENTS_KEY, this.commentsSignal());
  }
  addComment(comment: ListingComment): void {
    this.commentsSignal.update(items => [...items, comment]);
    this.storage.set(COMMENTS_KEY, this.commentsSignal());
  }
  commentsFor(listingId: string): ListingComment[] {
    return this.commentsSignal().filter(comment => comment.listingId === listingId);
  }
}
