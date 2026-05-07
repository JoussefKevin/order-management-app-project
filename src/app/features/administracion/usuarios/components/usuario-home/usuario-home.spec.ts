import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { UsuarioHome } from './usuario-home';

describe('UsuarioHome', () => {
  let component: UsuarioHome;
  let fixture: ComponentFixture<UsuarioHome>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsuarioHome, RouterTestingModule],
    }).compileComponents();

    fixture   = TestBed.createComponent(UsuarioHome);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crearse correctamente', () => {
    expect(component).toBeTruthy();
  });
});
