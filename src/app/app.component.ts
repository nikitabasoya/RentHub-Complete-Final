import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  template: `
    <header class="topbar">
      <a class="brand" routerLink="/" aria-label="RentHub home"><span class="brand-mark">r.</span><span>rent<span class="brand-accent">hub</span></span></a>
      <nav aria-label="Main navigation">
        <a class="nav-link" routerLink="/">Explore homes</a>
        @if (auth.user(); as user) {
          <a class="nav-link" routerLink="/listings/new">List a property <span class="plus">+</span></a>
          <a class="nav-link" routerLink="/profile">Hi, {{ user.name.split(' ')[0] }}</a>
          <button class="btn btn-dark btn-small" (click)="logout()">Log out</button>
        } @else {
          <a class="nav-link" routerLink="/auth">Sign in</a>
          <a class="btn btn-dark btn-small" routerLink="/auth" [queryParams]="{mode:'register'}">Get started <span aria-hidden="true">↗</span></a>
        }
      </nav>
    </header>
    <main><router-outlet /></main>
    <footer class="footer">
      <a class="brand" routerLink="/"><span class="brand-mark">r.</span><span>rent<span class="brand-accent">hub</span></span></a>
      <span>Find a place to belong.</span><span>© 2026 RentHub</span>
    </footer>
  `
})
export class AppComponent {
  constructor(public auth: AuthService) {}
  logout(): void { this.auth.logout(); }
}
