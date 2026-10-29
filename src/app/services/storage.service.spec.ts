import { TestBed } from '@angular/core/testing';
import { StorageService } from './storage.service';

describe('StorageService', () => {
  let service: StorageService;
  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({ providers: [StorageService] });
    service = TestBed.inject(StorageService);
  });
  it('returns fallback when a key does not exist', () => {
    expect(service.get('missing', ['fallback'])).toEqual(['fallback']);
  });
  it('persists and retrieves JSON values', () => {
    service.set('sample', { count: 3 });
    expect(service.get('sample', { count: 0 })).toEqual({ count: 3 });
  });
});
