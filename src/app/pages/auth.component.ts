import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  standalone: true, selector: 'app-auth', imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <section class="auth-layout">
      <div class="auth-art"><div class="eyebrow"><span class="eyebrow-dot"></span> WELCOME TO RENTHUB</div><h1>Find more than<br>a <em>place.</em></h1><p>Find your corner of the world. Save the spaces you love, ask the right questions, and make your next move with confidence.</p><div class="auth-art-image"><img src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1000&q=80" alt="A welcoming modern living space"><span>Good things start at home.</span></div></div>
      <div class="auth-form-wrap"><div class="auth-tabs"><button [class.active]="mode==='login'" (click)="mode='login';message=''">Sign in</button><button [class.active]="mode==='register'" (click)="mode='register';message=''">Create account</button></div>
        @if(mode==='login'){<div><div class="eyebrow">YOUR SPACE IS WAITING</div><h2>Welcome <em>back.</em></h2><p class="muted">Sign in to pick up where you left off.</p><form #loginForm="ngForm" (ngSubmit)="loginForm.valid && login()" novalidate>
          <label for="login-email">Email address</label><input id="login-email" type="email" name="email" [(ngModel)]="email" required email #loginEmail="ngModel" placeholder="you@example.com"><small class="error" *ngIf="loginEmail.invalid && loginEmail.touched">Enter a valid email address.</small>
          <label for="login-password">Password</label><input id="login-password" type="password" name="password" [(ngModel)]="password" required minlength="6" #loginPassword="ngModel" placeholder="At least 6 characters"><small class="error" *ngIf="loginPassword.invalid && loginPassword.touched">Password must be at least 6 characters.</small>
          @if(message){<p class="form-message" [class.success]="success">{{ message }}</p>}<button class="btn btn-dark auth-submit" type="submit">Sign in <span>↗</span></button>
        </form><p class="auth-switch">New to RentHub? <button (click)="mode='register'">Create an account</button></p></div>}
        @else {<div><div class="eyebrow">LET'S GET YOU SET UP</div><h2>Make yourself <em>at home.</em></h2><p class="muted">Create an account to save homes and connect with owners.</p><form #registerForm="ngForm" (ngSubmit)="registerForm.valid && register()" novalidate>
          <label for="register-name">Full name</label><input id="register-name" name="name" [(ngModel)]="name" required minlength="2" #regName="ngModel" placeholder="Your full name"><small class="error" *ngIf="regName.invalid && regName.touched">Please enter your name (at least 2 characters).</small>
          <label for="register-email">Email address</label><input id="register-email" type="email" name="regEmail" [(ngModel)]="email" required email #regEmail="ngModel" placeholder="you@example.com"><small class="error" *ngIf="regEmail.invalid && regEmail.touched">Enter a valid email address.</small>
          <label for="register-password">Password</label><input id="register-password" type="password" name="regPassword" [(ngModel)]="password" required minlength="6" #regPassword="ngModel" placeholder="At least 6 characters"><small class="error" *ngIf="regPassword.invalid && regPassword.touched">Use at least 6 characters.</small>
          <label for="role">I am joining as</label><select id="role" name="role" [(ngModel)]="role"><option value="renter">Looking for a home</option><option value="landlord">Listing a property</option></select>
          @if(message){<p class="form-message" [class.success]="success">{{ message }}</p>}<button class="btn btn-dark auth-submit" type="submit">Create account <span>↗</span></button>
        </form><p class="auth-switch">Already have an account? <button (click)="mode='login'">Sign in</button></p></div>}
        <p class="auth-note">Demo project · Your account data stays in this browser.</p>
      </div>
    </section>
  `,
  styles: [':host{display:block}']
})
export class AuthComponent {
  mode: 'login'|'register' = 'login';
  name='';email='';password='';role:'renter'|'landlord'='renter';message='';success=false;
  constructor(private auth:AuthService,private router:Router,private route:ActivatedRoute){
    this.mode=this.route.snapshot.queryParamMap.get('mode')==='register'?'register':'login';
    if(this.auth.isLoggedIn()) this.router.navigateByUrl('/');
  }
  login():void {
    const result=this.auth.login(this.email,this.password);this.message=result.message;this.success=result.ok;
    if(result.ok){const returnUrl=this.route.snapshot.queryParamMap.get('returnUrl')||'/';setTimeout(()=>void this.router.navigateByUrl(returnUrl),250);}
  }
  register():void {
    const result=this.auth.register(this.name,this.email,this.password,this.role);this.message=result.message;this.success=result.ok;
    if(result.ok)setTimeout(()=>void this.router.navigateByUrl('/'),250);
  }
}
