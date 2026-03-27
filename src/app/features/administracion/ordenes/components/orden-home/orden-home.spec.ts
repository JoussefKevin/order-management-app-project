import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdenHome } from './orden-home';

describe('OrdenHome', () => {
  let component: OrdenHome;
  let fixture: ComponentFixture<OrdenHome>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrdenHome]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrdenHome);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
