import { routes } from './app.routes';

describe('App routes', () => {
  it('declares a home route and guarded create/profile routes', () => {
    expect(routes.some(route => route.path === '')).toBe(true);
    expect(routes.find(route => route.path === 'listings/new')?.canActivate?.length).toBe(1);
    expect(routes.find(route => route.path === 'profile')?.canActivate?.length).toBe(1);
  });
});
