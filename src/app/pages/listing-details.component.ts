import { Component } from '@angular/core';
import { CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Listing, ListingComment } from '../models';
import { AuthService } from '../services/auth.service';
import { ListingService } from '../services/listing.service';

@Component({
  standalone:true,selector:'app-listing-details',imports:[CurrencyPipe,DatePipe,DecimalPipe,FormsModule,RouterLink],
  template:`
    @if(listing;as item){<section class="details-page"><a routerLink="/" class="back-link">← Back to all homes</a><div class="details-title-row"><div><div class="eyebrow">{{item.propertyType}} · {{item.city}}, {{item.state}}</div><h1>{{item.title}}</h1><p class="details-address">⌖ {{item.address}}, {{item.city}}, {{item.state}} {{item.zip}}</p></div><button class="btn btn-light" (click)="toggleFavourite()">{{service.isFavourite(item.id)?'♥ Saved to favourites':'♡ Save this home'}}</button></div>
      <div class="gallery" [class.single]="item.photos.length===1"><img [src]="item.photos[0]" [alt]="item.title">@for(photo of item.photos.slice(1);track photo){<img [src]="photo" [alt]="item.title+' photo'">}</div>
      <div class="details-layout"><div class="details-main"><div class="detail-facts"><div><span>⌂</span><b>{{item.area|number}} sq ft</b><small>Area</small></div><div><span>▦</span><b>{{item.bedrooms}} bedroom(s)</b><small>Bedrooms</small></div><div><span>◷</span><b>{{item.bathrooms}} bathroom(s)</b><small>Bathrooms</small></div><div><span>⌁</span><b>{{item.furnished?'Furnished':'Unfurnished'}}</b><small>Condition</small></div></div>
        <section class="detail-section"><div class="eyebrow">THE DETAILS</div><h2>About this <em>space.</em></h2><p>{{item.description}}</p><p class="detail-extra">{{item.shared?'Shared property':'Entire property'}} · {{item.leaseType==='long-term'?'Long-term lease (6+ months)':item.leaseType==='short-term'?'Short-term lease':'Short or long-term lease'}} · {{item.negotiable?'Rent negotiable':'Fixed rent'}} · {{item.priceMode==='utilities-included'?'Utilities included':'Utilities charged separately'}}</p></section>
        <section class="detail-section"><div class="eyebrow">THE EXTRAS</div><h2>What comes <em>with it.</em></h2><div class="detail-amenities">@for(a of item.amenities;track a){<span>✓ {{a}}</span>}@if(!item.amenities.length){<span>No amenities listed</span>}</div><p class="detail-extra">Vegetarian preference: {{item.vegetarianPreference==='no-preference'?'No preference':item.vegetarianPreference==='yes'?'Vegetarian only':'No restriction'}}</p></section>
        <section class="comments-section"><div class="eyebrow">LET'S TALK</div><h2>Questions & <em>comments.</em></h2><p class="muted">Ask a question or share information about this listing.</p>
          @if(comments.length){@for(comment of comments;track comment.id){<div class="comment"><div class="comment-avatar">{{comment.userName.charAt(0).toUpperCase()}}</div><div class="comment-content"><div class="comment-top"><b>{{comment.userName}}</b><time>{{comment.createdAt|date:'mediumDate'}}</time></div><p>{{comment.message}}</p>@if(auth.user()){<button class="reply-link" (click)="replyTo=comment.id">Reply ↗</button>}@if(replyTo===comment.id){<form class="reply-form" (ngSubmit)="reply(comment.id)"><input name="reply-{{comment.id}}" [(ngModel)]="replyMessage" required minlength="2" placeholder="Write a reply..."><button class="btn btn-dark btn-small">Reply</button></form>}@for(child of childComments(comment.id);track child.id){<div class="comment child-comment"><div class="comment-avatar">{{child.userName.charAt(0).toUpperCase()}}</div><div class="comment-content"><div class="comment-top"><b>{{child.userName}}</b><time>{{child.createdAt|date:'mediumDate'}}</time></div><p>{{child.message}}</p></div></div>}</div></div>}}@else{<div class="no-comments">No comments yet. Start the conversation.</div>}
          @if(auth.user()){<form class="comment-form" (ngSubmit)="addComment()"><label for="comment">Leave a comment</label><textarea id="comment" name="comment" [(ngModel)]="commentMessage" required minlength="2" maxlength="1000" rows="3" placeholder="Ask about availability, terms, or the neighbourhood..."></textarea><button class="btn btn-dark" type="submit">Post comment ↗</button></form>}@else{<div class="sign-in-note"><a routerLink="/auth">Sign in</a> to leave a comment or reply.</div>}
        </section></div>
        <aside class="contact-card"><div class="price">{{item.rent|currency:'INR':'symbol':'1.0-0'}}<small>/ month</small></div><p class="muted">{{item.priceMode==='utilities-included'?'Utilities included in rent':'Utilities billed separately'}}</p><div class="contact-divider"></div><div class="owner-row"><div class="owner-avatar">{{item.ownerName.charAt(0).toUpperCase()}}</div><div><b>{{item.contactName}}</b><small>Property contact</small></div></div><p class="contact-tip">Interested in this home? Send a message to start a conversation.</p><a class="btn btn-dark contact-btn" [href]="'mailto:'+item.contactEmail+'?subject='+encodeSubject('Enquiry about '+item.title)">Email the owner ↗</a><div class="contact-detail"><small>EMAIL</small><span>{{item.contactEmail}}</span></div><div class="contact-detail"><small>PHONE</small><span>{{item.contactPhone}}</span></div>@if(auth.user()?.id===item.ownerId){<a class="btn btn-light contact-btn" [routerLink]="['/listings',item.id,'edit']">Edit listing</a><button class="delete-link" (click)="deleteListing()">Delete listing</button>}<div class="listed-date">Listed {{item.createdAt|date:'mediumDate'}}</div></aside>
      </div></section>}@else{<section class="empty-state"><h2>We couldn't find this home.</h2><a routerLink="/" class="btn btn-dark">Back to home</a></section>}
  `
})
export class ListingDetailsComponent {
  encodeSubject(value: string): string { return encodeURIComponent(value); }
  listing:Listing|undefined;
  commentMessage='';replyMessage='';replyTo:string|null=null;
  constructor(private route:ActivatedRoute,public service:ListingService,public auth:AuthService,private router:Router){
    const id=this.route.snapshot.paramMap.get('id');
    this.listing=this.service.listings().find(item=>item.id===id);
  }
  get comments():ListingComment[]{return this.listing?this.service.commentsFor(this.listing.id).filter(item=>!item.parentId):[];}
  childComments(id:string):ListingComment[]{return this.listing?this.service.commentsFor(this.listing.id).filter(item=>item.parentId===id):[];}
  toggleFavourite():void{if(!this.auth.user()){void this.router.navigate(['/auth']);return;}if(this.listing)this.service.toggleFavourite(this.listing.id);}
  addComment():void{const user=this.auth.user();if(!user||!this.listing||this.commentMessage.trim().length<2)return;this.service.addComment({id:crypto.randomUUID(),listingId:this.listing.id,userId:user.id,userName:user.name,message:this.commentMessage.trim(),parentId:null,createdAt:new Date().toISOString()});this.commentMessage='';}
  reply(parentId:string):void{const user=this.auth.user();if(!user||!this.listing||this.replyMessage.trim().length<2)return;this.service.addComment({id:crypto.randomUUID(),listingId:this.listing.id,userId:user.id,userName:user.name,message:this.replyMessage.trim(),parentId,createdAt:new Date().toISOString()});this.replyMessage='';this.replyTo=null;}
  deleteListing():void{if(this.listing&&this.auth.user()?.id===this.listing.ownerId&&confirm('Delete this listing? This cannot be undone.')){this.service.delete(this.listing.id);void this.router.navigate(['/']);}}
}
