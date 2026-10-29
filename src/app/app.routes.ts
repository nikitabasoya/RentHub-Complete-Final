import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home.component';
import { AuthComponent } from './pages/auth.component';
import { ListingDetailsComponent } from './pages/listing-details.component';
import { ListingFormComponent } from './pages/listing-form.component';
import { ProfileComponent } from './pages/profile.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent, title: 'RentHub — Find a place to call home' },
  { path: 'auth', component: AuthComponent, title: 'Sign in or create an account — RentHub' },
  { path: 'listings/new', component: ListingFormComponent, canActivate: [authGuard], title: 'Create a listing — RentHub' },
  { path: 'listings/:id/edit', component: ListingFormComponent, canActivate: [authGuard], title: 'Edit listing — RentHub' },
  { path: 'listings/:id', component: ListingDetailsComponent, title: 'Property details — RentHub' },
  { path: 'profile', component: ProfileComponent, canActivate: [authGuard], title: 'Your profile — RentHub' },
  { path: '**', redirectTo: '' }
];
