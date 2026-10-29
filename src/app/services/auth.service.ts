import { Injectable, computed, signal } from '@angular/core';
import { AppUser } from '../models';
import { StorageService } from './storage.service';

const USERS_KEY = 'renthub.users';
const SESSION_KEY = 'renthub.session';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private users = this.storage.get<AppUser[]>(USERS_KEY, []);
  private current = signal<AppUser | null>(this.restoreSession());
  readonly user = this.current.asReadonly();
  readonly isLoggedIn = computed(() => this.current() !== null);

  constructor(private storage: StorageService) {}

  private restoreSession(): AppUser | null {
    const sessionId = this.storage.get<string | null>(SESSION_KEY, null);
    const users = this.storage.get<AppUser[]>(USERS_KEY, []);
    return users.find(user => user.id === sessionId) ?? null;
  }
  register(name: string, email: string, password: string, role: 'renter' | 'landlord'): {ok: boolean; message: string} {
    this.users = this.storage.get<AppUser[]>(USERS_KEY, []);
    const normalizedEmail = email.trim().toLowerCase();
    if (this.users.some(user => user.email.toLowerCase() === normalizedEmail)) {
      return { ok: false, message: 'An account with this email already exists.' };
    }
    const user: AppUser = {
      id: crypto.randomUUID(), name: name.trim(), email: normalizedEmail, password, role
    };
    this.users = [...this.users, user];
    this.storage.set(USERS_KEY, this.users);
    this.storage.set(SESSION_KEY, user.id);
    this.current.set(user);
    return { ok: true, message: 'Account created successfully.' };
  }
  login(email: string, password: string): {ok: boolean; message: string} {
    this.users = this.storage.get<AppUser[]>(USERS_KEY, []);
    const user = this.users.find(item => item.email.toLowerCase() === email.trim().toLowerCase() && item.password === password);
    if (!user) return { ok: false, message: 'Email or password is incorrect.' };
    this.storage.set(SESSION_KEY, user.id);
    this.current.set(user);
    return { ok: true, message: 'Welcome back!' };
  }
  logout(): void {
    this.storage.remove(SESSION_KEY);
    this.current.set(null);
  }
}
