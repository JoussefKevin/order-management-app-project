import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { ordenResolver } from './orden-resolver';

describe('ordenResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => ordenResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
