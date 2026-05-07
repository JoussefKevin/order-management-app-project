import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FooderComponent } from './fooder';

describe('FooderComponent', () => {
  let component: FooderComponent;
  let fixture: ComponentFixture<FooderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FooderComponent],
    }).compileComponents();

    fixture   = TestBed.createComponent(FooderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debe tener el año actual', () => {
    expect(component.year).toBe(new Date().getFullYear());
  });
});
