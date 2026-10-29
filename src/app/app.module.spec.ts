import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app.component';
import { routes } from './app.routes';

describe('RentHub application testing module', () => {
  it('configures the standalone root component and application routes', async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [provideRouter(routes)]
    }).compileComponents();

    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
    expect(routes.some(route => route.path === '')).toBe(true);
  });
});
