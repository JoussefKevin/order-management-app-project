import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ProductoHomeComponent } from './producto-home';

describe('ProductoHomeComponent', () => {
  let component: ProductoHomeComponent;
  let fixture: ComponentFixture<ProductoHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductoHomeComponent, RouterTestingModule],
    }).compileComponents();

    fixture   = TestBed.createComponent(ProductoHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crearse correctamente', () => {
    expect(component).toBeTruthy();
  });
});
