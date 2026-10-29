import { Component } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Listing } from '../models';
import { AuthService } from '../services/auth.service';
import { ListingService } from '../services/listing.service';

@Component({
  standalone:true,selector:'app-listing-form',imports:[CommonModule,DecimalPipe,FormsModule,RouterLink],
  template:`
    <section class="form-page"><a routerLink="/" class="back-link">← Back to all homes</a><div class="form-intro"><div class="eyebrow">YOUR SPACE, YOUR STORY</div><h1>{{ editing ? 'Edit your' : 'List your' }} <em>property.</em></h1><p>Tell people what makes this place special. Clear details help the right people find you.</p></div>
      <div class="form-progress"><span [class.current]="step===1">01 <b>Property details</b></span><i></i><span [class.current]="step===2">02 <b>Features & contact</b></span><i></i><span [class.current]="step===3">03 <b>Preview & submit</b></span></div>
      @if(step===1){<form #stepOne="ngForm" (ngSubmit)="stepOne.valid && step=2" class="property-form" novalidate>
        <div class="form-section-title"><span>01</span><div><h2>Let's start with the basics</h2><p>The essentials renters want to know first.</p></div></div>
        <div class="form-grid"><div class="form-control"><label for="title">Listing title *</label><input id="title" name="title" [(ngModel)]="draft.title" required minlength="8" maxlength="90" #title="ngModel" placeholder="e.g. Bright apartment with balcony"><small class="error" *ngIf="title.invalid&&title.touched">Add a title with at least 8 characters.</small></div>
        <div class="form-control"><label for="propertyType">Property type *</label><select id="propertyType" name="propertyType" [(ngModel)]="draft.propertyType" required><option value="Apartment">Apartment</option><option value="Studio">Studio</option><option value="House">House</option><option value="Room">Room</option></select></div>
        <div class="form-control"><label for="buildingName">Apartment / building name</label><input id="buildingName" name="buildingName" [(ngModel)]="draft.buildingName" placeholder="Building or community name"></div>
        <div class="form-control"><label for="shared">Is this a shared property? *</label><select id="shared" name="shared" [(ngModel)]="draft.shared"><option [ngValue]="false">No, entire property</option><option [ngValue]="true">Yes, shared property</option></select></div>
        <div class="form-control full"><label for="address">Street address *</label><input id="address" name="address" [(ngModel)]="draft.address" required minlength="5" #address="ngModel" placeholder="House number and street"><small class="error" *ngIf="address.invalid&&address.touched">Enter a complete street address.</small></div>
        <div class="form-control"><label for="city">City *</label><input id="city" name="city" [(ngModel)]="draft.city" required #city="ngModel" placeholder="City"><small class="error" *ngIf="city.invalid&&city.touched">City is required.</small></div>
        <div class="form-control"><label for="state">State *</label><input id="state" name="state" [(ngModel)]="draft.state" required #state="ngModel" placeholder="State"><small class="error" *ngIf="state.invalid&&state.touched">State is required.</small></div>
        <div class="form-control"><label for="zip">PIN code *</label><input id="zip" name="zip" [(ngModel)]="draft.zip" required pattern="[0-9]{6}" #zip="ngModel" placeholder="6-digit PIN code"><small class="error" *ngIf="zip.invalid&&zip.touched">Enter a valid 6-digit PIN code.</small></div>
        <div class="form-control"><label for="area">Area (sq ft) *</label><input id="area" name="area" type="number" [(ngModel)]="draft.area" required min="100" max="100000" #area="ngModel" placeholder="e.g. 950"><small class="error" *ngIf="area.invalid&&area.touched">Area must be at least 100 sq ft.</small></div>
        <div class="form-control"><label for="bedrooms">Bedrooms *</label><input id="bedrooms" name="bedrooms" type="number" [(ngModel)]="draft.bedrooms" required min="0" max="30"></div>
        <div class="form-control"><label for="bathrooms">Bathrooms *</label><input id="bathrooms" name="bathrooms" type="number" [(ngModel)]="draft.bathrooms" required min="1" max="30"></div></div>
        <div class="form-actions"><span>Step 1 of 3</span><button class="btn btn-dark" type="submit">Continue to features ↗</button></div>
      </form>}
      @if(step===2){<form #stepTwo="ngForm" (ngSubmit)="stepTwo.valid && step=3" class="property-form" novalidate>
        <div class="form-section-title"><span>02</span><div><h2>Make the details count</h2><p>Rental terms, amenities and how renters can reach you.</p></div></div>
        <div class="form-grid"><div class="form-control"><label for="rent">Expected monthly rent (₹) *</label><input id="rent" name="rent" type="number" [(ngModel)]="draft.rent" required min="1000" max="10000000" #rent="ngModel" placeholder="e.g. 25000"><small class="error" *ngIf="rent.invalid&&rent.touched">Rent must be at least ₹1,000.</small></div>
        <div class="form-control"><label for="priceMode">Price mode</label><select id="priceMode" name="priceMode" [(ngModel)]="draft.priceMode"><option value="monthly">Utilities charged separately</option><option value="utilities-included">Utilities included in rent</option></select></div>
        <div class="form-control"><label for="leaseType">Stay / lease type *</label><select id="leaseType" name="leaseType" [(ngModel)]="draft.leaseType"><option value="long-term">Long term (6+ months)</option><option value="short-term">Short term</option><option value="both">Both</option></select></div>
        <div class="form-control"><label for="furnished">Is it furnished? *</label><select id="furnished" name="furnished" [(ngModel)]="draft.furnished"><option [ngValue]="true">Yes, furnished</option><option [ngValue]="false">No, unfurnished</option></select></div>
        <div class="form-control"><label for="negotiable">Rent negotiation</label><select id="negotiable" name="negotiable" [(ngModel)]="draft.negotiable"><option [ngValue]="false">Rent is fixed</option><option [ngValue]="true">Rent is negotiable</option></select></div>
        <div class="form-control"><label for="vegetarian">Vegetarian preference</label><select id="vegetarian" name="vegetarian" [(ngModel)]="draft.vegetarianPreference"><option value="no-preference">No preference</option><option value="yes">Vegetarian only</option><option value="no">No restriction</option></select></div>
        <div class="form-control full"><label>Amenities included</label><div class="amenities-grid">@for (amenity of amenities;track amenity){<label class="check-option"><input type="checkbox" [checked]="draft.amenities.includes(amenity)" (change)="toggleAmenity(amenity,$any($event.target).checked)"><span>{{ amenity }}</span></label>}</div></div>
        <div class="form-control full"><label for="description">Description * <small>({{draft.description.length}} / 1400)</small></label><textarea id="description" name="description" [(ngModel)]="draft.description" required minlength="30" maxlength="1400" rows="5" #description="ngModel" placeholder="Describe the space, neighbourhood, transport links and anything else a renter should know."></textarea><small class="error" *ngIf="description.invalid&&description.touched">Please add at least 30 characters (maximum 1,400).</small></div>
        <div class="form-control"><label for="photo1">Photo URL 1 *</label><input id="photo1" name="photo1" type="url" [(ngModel)]="photo1" required pattern="https?://.+" #p1="ngModel" placeholder="https://..."><small class="error" *ngIf="p1.invalid&&p1.touched">Enter a valid image URL.</small></div>
        <div class="form-control"><label for="photo2">Photo URL 2 (optional)</label><input id="photo2" name="photo2" type="url" [(ngModel)]="photo2" placeholder="https://..."></div>
        <div class="form-control"><label for="contactName">Contact name *</label><input id="contactName" name="contactName" [(ngModel)]="draft.contactName" required minlength="2" #cn="ngModel"><small class="error" *ngIf="cn.invalid&&cn.touched">Enter a contact name.</small></div>
        <div class="form-control"><label for="contactEmail">Contact email *</label><input id="contactEmail" name="contactEmail" type="email" [(ngModel)]="draft.contactEmail" required email #ce="ngModel" placeholder="owner@example.com"><small class="error" *ngIf="ce.invalid&&ce.touched">Enter a valid contact email.</small></div>
        <div class="form-control"><label for="contactPhone">Contact phone *</label><input id="contactPhone" name="contactPhone" type="tel" [(ngModel)]="draft.contactPhone" required pattern="[0-9+() -]{10,16}" #cp="ngModel" placeholder="10-digit phone number"><small class="error" *ngIf="cp.invalid&&cp.touched">Enter a valid contact phone number.</small></div></div>
        <div class="form-actions"><button class="btn btn-light" type="button" (click)="step=1">← Back</button><button class="btn btn-dark" type="submit">Preview listing ↗</button></div>
      </form>}
      @if(step===3){<section class="property-form preview-form"><div class="form-section-title"><span>03</span><div><h2>One last look.</h2><p>Review the details before publishing your listing.</p></div></div><div class="preview-photo"><img [src]="photo1 || fallbackPhoto" alt="Property preview"><span>{{draft.propertyType}}</span></div><div class="preview-heading"><div><h2>{{draft.title}}</h2><p>⌖ {{draft.address}}, {{draft.city}}, {{draft.state}} {{draft.zip}}</p></div><div class="preview-price">₹{{draft.rent | number}}<small>/ month</small></div></div><div class="preview-facts"><div><small>AREA</small><b>{{draft.area | number}} sq ft</b></div><div><small>BEDROOMS</small><b>{{draft.bedrooms}}</b></div><div><small>BATHROOMS</small><b>{{draft.bathrooms}}</b></div><div><small>LEASE</small><b>{{draft.leaseType}}</b></div></div><h3>About this home</h3><p class="preview-description">{{draft.description}}</p><h3>Included amenities</h3><div class="detail-amenities">@for (amenity of draft.amenities;track amenity){<span>✓ {{amenity}}</span>}@if(!draft.amenities.length){<span>No amenities selected</span>}</div><p class="preview-contact">Contact: {{draft.contactName}} · {{draft.contactEmail}} · {{draft.contactPhone}}</p><div class="form-actions"><button class="btn btn-light" (click)="step=2">← Edit details</button><button class="btn btn-dark" (click)="publish()">Publish property ↗</button></div></section>}
    </section>
  `
})
export class ListingFormComponent {
  step=1;
  editing=false; editId='';photo1='';photo2='';
  readonly fallbackPhoto='https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80';
  readonly amenities=['Gym/Fitness Center','Swimming Pool','Car Park','Visitors Parking','Power Backup','Garbage Disposal','Private Lawn','Water Heater','Plant Security System','Laundry Service','Elevator','Club House'];
  draft: Listing = this.emptyDraft();
  constructor(private auth:AuthService,private service:ListingService,private router:Router,route:ActivatedRoute){
    const id=route.snapshot.paramMap.get('id');
    if(id){const found=this.service.listings().find(item=>item.id===id);if(found&&found.ownerId===this.auth.user()?.id){this.draft={...found,amenities:[...found.amenities]};this.photo1=found.photos[0]??'';this.photo2=found.photos[1]??'';this.editing=true;this.editId=id;}}
    this.draft.contactName=this.draft.contactName||this.auth.user()?.name||'';
    this.draft.contactEmail=this.draft.contactEmail||this.auth.user()?.email||'';
  }
  private emptyDraft():Listing{return {id:'',title:'',propertyType:'Apartment',buildingName:'',shared:false,address:'',city:'',state:'',zip:'',area:800,bedrooms:2,bathrooms:1,rent:20000,priceMode:'monthly',negotiable:false,leaseType:'long-term',furnished:false,vegetarianPreference:'no-preference',amenities:[],description:'',contactName:'',contactEmail:'',contactPhone:'',photos:[],ownerId:'',ownerName:'',createdAt:''};}
  toggleAmenity(amenity:string,checked:boolean):void{this.draft.amenities=checked?[...this.draft.amenities,amenity]:this.draft.amenities.filter(item=>item!==amenity);}
  publish():void{
    const user=this.auth.user();if(!user)return;
    const listing:Listing={...this.draft,id:this.editing?this.editId:crypto.randomUUID(),photos:[this.photo1||this.fallbackPhoto,...(this.photo2?[this.photo2]:[])],ownerId:user.id,ownerName:user.name,createdAt:this.editing?this.draft.createdAt:new Date().toISOString()};
    this.service.save(listing);void this.router.navigate(['/listings',listing.id]);
  }
}
