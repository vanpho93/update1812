import { TestBed, async, inject } from '@angular/core/testing';

import { MustBeGuestGuard } from './must-be-guest.guard';

describe('MustBeGuestGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MustBeGuestGuard]
    });
  });

  it('should ...', inject([MustBeGuestGuard], (guard: MustBeGuestGuard) => {
    expect(guard).toBeTruthy();
  }));
});
