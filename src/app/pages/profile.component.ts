import { Component } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ListingService } from '../services/listing.service';

@Component({
  standalone:true,selector:'app-profile',imports:[CurrencyPipe,RouterLink],
  template:`
    @if(auth.user();as user){<section class="profile-page"><div class="eyebrow">YOUR RENTHUB</div><h1>Your spaces, <em>your way.</em></h1><div class="profile-card"><div class="profile-avatar">{{user.name.charAt(0).toUpperCase()}}</div><div><h2>{{user.name}}</h2><p>{{user.email}}</p><span class="role-tag">{{user.role==='landlord'?'Property host':'Home seeker'}}</span></div></div>
      <div class="profile-columns"><section><div class="section-heading"><div><div class="eyebrow">YOUR CONTRIBUTION</div><h2>Your <em>listings.</em></h2></div><a class="btn btn-dark" routerLink="/listings/new">+ Add property</a></div>@if(ownedListings.length){@for(item of ownedListings;track item.id){<a class="profile-listing" [routerLink]="['/listings',item.id]"><img [src]="item.photos[0]" [alt]="item.title"><div><b>{{item.title}}</b><span>{{item.city}}, {{item.state}}</span><strong>{{item.rent|currency:'INR':'symbol':'1.0-0'}} / month</strong></div><span>↗</span></a>}}@else{<div class="profile-empty"><p>You haven't listed a property yet.</p><a routerLink="/listings/new">Create your first listing ↗</a></div>}</section>
      <section><div class="section-heading"><div><div class="eyebrow">SAVED FOR LATER</div><h2>Favourite <em>homes.</em></h2></div></div>@if(favouriteListings.length){@for(item of favouriteListings;track item.id){<a class="profile-listing" [routerLink]="['/listings',item.id]"><img [src]="item.photos[0]" [alt]="item.title"><div><b>{{item.title}}</b><span>{{item.city}}, {{item.state}}</span><strong>{{item.rent|currency:'INR':'symbol':'1.0-0'}} / month</strong></div><span>↗</span></a>}}@else{<div class="profile-empty"><p>No favourites saved yet.</p><a routerLink="/">Explore homes ↗</a></div>}</section></div>
    </section>}
  `
})
export class ProfileComponent {
  constructor(public auth:AuthService,private service:ListingService){}
  get ownedListings(){const user=this.auth.user();return user?this.service.listings().filter(item=>item.ownerId===user.id):[];}
  get favouriteListings(){return this.service.listings().filter(item=>this.service.isFavourite(item.id));}
}
