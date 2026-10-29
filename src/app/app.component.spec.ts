import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app.component';
import { AuthService } from './services/auth.service';
import { StorageService } from './services/storage.service';

describe('AppComponent', () => {
  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [provideRouter([]), AuthService, StorageService]
    }).compileComponents();
  });
  it('creates the application shell', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
    expect(fixture.nativeElement.querySelector('.brand').textContent).toContain('rent');
  });
});
