import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsuarioHome } from './usuario-home';

describe('UsuarioHome', () => {
  let component: UsuarioHome;
  let fixture: ComponentFixture<UsuarioHome>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsuarioHome]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsuarioHome);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
