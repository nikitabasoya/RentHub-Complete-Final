import { Component, computed, signal } from '@angular/core';
import { CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Listing } from '../models';
import { ListingService } from '../services/listing.service';
import { AuthService } from '../services/auth.service';

@Component({
  standalone: true,
  selector: 'app-home',
  imports: [CurrencyPipe, DatePipe, DecimalPipe, FormsModule, RouterLink],
  template: `
    <section class="hero">
      <div class="hero-copy">
        <div class="eyebrow"><span class="eyebrow-dot"></span> A better way to find home</div>
        <h1>Space to live.<br><em>Room to grow.</em></h1>
        <p class="hero-sub">Thoughtful spaces, honest details, and a smoother way to find your next chapter.</p>
        <div class="hero-stats"><div><strong>{{ listingService.listings().length }}+</strong><span>places to explore</span></div><i></i><div><strong>100%</strong><span>your kind of search</span></div></div>
      </div>
      <div class="hero-visual">
        <img src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&q=85" alt="Sunlit contemporary living room">
        <div class="image-label"><span class="label-icon">✳</span><div><b>Find your feeling of home</b><small>Every place has a story.</small></div></div>
        <div class="floating-note"><span>⌂</span><div><b>Good spaces.</b><small>Better beginnings.</small></div></div>
      </div>
    </section>

    <section class="search-panel" aria-label="Search and filter properties">
      <div class="search-field search-location"><label for="search">LOCATION OR KEYWORD</label><div class="field-icon">⌕ <input id="search" [(ngModel)]="query" placeholder="City, neighbourhood, or keyword"></div></div>
      <div class="search-field"><label for="type">PROPERTY TYPE</label><select id="type" [(ngModel)]="typeFilter"><option value="">All property types</option><option>Apartment</option><option>Studio</option><option>House</option><option>Room</option></select></div>
      <div class="search-field"><label for="budget">MAX MONTHLY RENT</label><select id="budget" [(ngModel)]="maxRent"><option [ngValue]="1000000">Any budget</option><option [ngValue]="15000">Up to ₹15,000</option><option [ngValue]="25000">Up to ₹25,000</option><option [ngValue]="35000">Up to ₹35,000</option><option [ngValue]="50000">Up to ₹50,000</option></select></div>
      <button class="btn btn-dark search-btn" (click)="page.set(1)">Find a home <span>↗</span></button>
    </section>

    <section class="featured-section">
      <div class="section-heading">
        <div><div class="eyebrow">THE SHORTLIST</div><h2>Featured <em>finds.</em></h2><p>Places with a little something special.</p></div>
        <div class="carousel-controls"><button class="circle-btn" (click)="moveFeatured(-1)" aria-label="Previous featured listing">←</button><button class="circle-btn" (click)="moveFeatured(1)" aria-label="Next featured listing">→</button></div>
      </div>
      @if (featured(); as item) {
        <article class="featured-card">
          <div class="featured-image"><img [src]="item.photos[0]" [alt]="item.title"><span class="featured-badge">✦ FEATURED FIND</span></div>
          <div class="featured-info"><div class="listing-meta">{{ item.city }}, {{ item.state }} <span>·</span> {{ item.propertyType }}</div><h3>{{ item.title }}</h3><p>{{ item.description }}</p><div class="featured-bottom"><div class="price">{{ item.rent | currency:'INR':'symbol':'1.0-0' }}<small>/ month</small></div><div class="featured-actions"><button class="btn btn-light" (click)="toggleFavourite(item.id)">{{ listingService.isFavourite(item.id) ? '♥ Saved' : '♡ Save' }}</button><a class="btn btn-dark" [routerLink]="['/listings',item.id]">View details ↗</a></div></div><div class="feature-specs"><span>⌂ {{ item.area | number }} sq ft</span><span>▦ {{ item.bedrooms }} bed</span><span>◷ {{ item.bathrooms }} bath</span></div></div>
        </article>
      }
    </section>

    <section class="listings-section" id="listings">
      <div class="section-heading listings-heading"><div><div class="eyebrow">MADE FOR YOUR NEXT CHAPTER</div><h2>Find your <em>place.</em></h2><p>{{ filteredListings().length }} thoughtfully listed spaces to explore.</p></div>
        <div class="sort-box"><label for="sort">Sort by</label><select id="sort" [(ngModel)]="sortBy"><option value="newest">Newest first</option><option value="priceAsc">Price: low to high</option><option value="priceDesc">Price: high to low</option><option value="areaDesc">Largest area</option></select></div>
      </div>
      <div class="filter-chips"><button [class.active]="favouriteOnly()" (click)="favouriteOnly.set(!favouriteOnly())">♡ Favourites only</button><button [class.active]="furnishedOnly()" (click)="furnishedOnly.set(!furnishedOnly())">Furnished</button><button [class.active]="longTermOnly()" (click)="longTermOnly.set(!longTermOnly())">Long-term lease</button><button class="clear-filters" (click)="clearFilters()">Clear filters ↺</button></div>
      @if (pagedListings().length) {
        <div class="listing-grid">
          @for (item of pagedListings(); track item.id) {
            <article class="listing-card">
              <a class="card-image" [routerLink]="['/listings',item.id]"><img [src]="item.photos[0]" [alt]="item.title" loading="lazy"><span class="type-tag">{{ item.propertyType }}</span></a>
              <button class="heart-btn" [class.saved]="listingService.isFavourite(item.id)" (click)="toggleFavourite(item.id)" [attr.aria-label]="listingService.isFavourite(item.id) ? 'Remove from favourites' : 'Add to favourites'">{{ listingService.isFavourite(item.id) ? '♥' : '♡' }}</button>
              <div class="card-body"><div class="listing-meta">⌖ {{ item.city }}, {{ item.state }}</div><h3><a [routerLink]="['/listings',item.id]">{{ item.title }}</a></h3><p class="card-description">{{ item.description }}</p><div class="card-specs"><span>{{ item.bedrooms }} bed</span><span>{{ item.bathrooms }} bath</span><span>{{ item.area | number }} sq ft</span></div><div class="card-bottom"><div class="price">{{ item.rent | currency:'INR':'symbol':'1.0-0' }}<small>/mo</small></div><a class="text-link" [routerLink]="['/listings',item.id]">Explore ↗</a></div></div>
            </article>
          }
        </div>
        <div class="pagination"><span>Showing {{ (page()-1)*pageSize+1 }}–{{ Math.min(page()*pageSize,filteredListings().length) }} of {{ filteredListings().length }}</span><div><button class="page-btn" [disabled]="page()===1" (click)="page.update(p=>p-1)" aria-label="Previous page">←</button><span class="page-number">{{ page() }} / {{ totalPages() }}</span><button class="page-btn" [disabled]="page()>=totalPages()" (click)="page.update(p=>p+1)" aria-label="Next page">→</button></div></div>
      } @else {
        <div class="empty-state"><span>⌂</span><h3>No homes found just yet.</h3><p>Try adjusting your search or clearing a filter to see more places.</p><button class="btn btn-dark" (click)="clearFilters()">Show all homes</button></div>
      }
    </section>
    <section class="host-banner"><div><div class="eyebrow">HAVE A SPACE TO SHARE?</div><h2>Your property could be<br><em>someone's next home.</em></h2><p>Create a listing and connect with people looking for a place like yours.</p><a class="btn btn-dark" [routerLink]="auth.user() ? '/listings/new' : '/auth'" [queryParams]="auth.user() ? {} : {mode:'register'}">List your property ↗</a></div><div class="banner-art"><span>⌂</span><span>✳</span><span>↗</span></div></section>
  `
})
export class HomeComponent {
  readonly Math = Math;
  query = '';
  typeFilter = '';
  maxRent = 1000000;
  sortBy = 'newest';
  page = signal(1);
  readonly pageSize = 6;
  favouriteOnly = signal(false);
  furnishedOnly = signal(false);
  longTermOnly = signal(false);
  featuredIndex = signal(0);
  constructor(public listingService: ListingService, public auth: AuthService) {}
  filteredListings = computed(() => {
    const q = this.query.trim().toLowerCase();
    let items = this.listingService.listings().filter(item => {
      const matchesQuery = !q || [item.title,item.city,item.state,item.address,item.description,item.buildingName].some(v=>v.toLowerCase().includes(q));
      return matchesQuery && (!this.typeFilter || item.propertyType===this.typeFilter) && item.rent<=Number(this.maxRent)
        && (!this.favouriteOnly() || this.listingService.isFavourite(item.id))
        && (!this.furnishedOnly() || item.furnished)
        && (!this.longTermOnly() || item.leaseType!=='short-term');
    });
    if (this.sortBy==='priceAsc') items=[...items].sort((a,b)=>a.rent-b.rent);
    else if (this.sortBy==='priceDesc') items=[...items].sort((a,b)=>b.rent-a.rent);
    else if (this.sortBy==='areaDesc') items=[...items].sort((a,b)=>b.area-a.area);
    else items=[...items].sort((a,b)=>b.createdAt.localeCompare(a.createdAt));
    return items;
  });
  pagedListings = computed(() => this.filteredListings().slice((this.page()-1)*this.pageSize,this.page()*this.pageSize));
  totalPages = computed(() => Math.max(1,Math.ceil(this.filteredListings().length/this.pageSize)));
  featured = computed(() => {
    const items=this.listingService.listings();
    return items.length ? items[((this.featuredIndex()%items.length)+items.length)%items.length] : null;
  });
  moveFeatured(direction:number):void { this.featuredIndex.update(i=>i+direction); }
  toggleFavourite(id:string):void { if(!this.auth.isLoggedIn()){location.href='/auth';return;} this.listingService.toggleFavourite(id); }
  clearFilters():void { this.query='';this.typeFilter='';this.maxRent=1000000;this.sortBy='newest';this.favouriteOnly.set(false);this.furnishedOnly.set(false);this.longTermOnly.set(false);this.page.set(1); }
}
