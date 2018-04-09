import { TestBed, async, inject } from '@angular/core/testing';

import { MustLoggedInGuard } from './must-logged-in.guard';

describe('MustLoggedInGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MustLoggedInGuard]
    });
  });

  it('should ...', inject([MustLoggedInGuard], (guard: MustLoggedInGuard) => {
    expect(guard).toBeTruthy();
  }));
});
