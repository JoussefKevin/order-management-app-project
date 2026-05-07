import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SidebarComponent } from './sidebar';
import { AuthService } from '../../../core/auth/services/auth';

describe('SidebarComponent', () => {
  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;
  let authSpy: { userRole: jasmine.Spy; isLoggedIn: jasmine.Spy };

  beforeEach(async () => {
    authSpy = {
      userRole:   jasmine.createSpy('userRole').and.returnValue('ADMIN'),
      isLoggedIn: jasmine.createSpy('isLoggedIn').and.returnValue(true),
    };

    await TestBed.configureTestingModule({
      imports: [SidebarComponent, RouterTestingModule],
      providers: [{ provide: AuthService, useValue: authSpy }],
    }).compileComponents();

    fixture   = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('filteredNavItems debe mostrar todos los items para ADMIN', () => {
    authSpy.userRole.and.returnValue('ADMIN');
    const items = component.filteredNavItems;
    expect(items.length).toBe(3);
  });

  it('filteredNavItems debe mostrar solo los items permitidos para CLIENT', () => {
    authSpy.userRole.and.returnValue('CLIENT');
    const items = component.filteredNavItems;
    const labels = items.map(i => i.label);
    expect(labels).toContain('Home');
    expect(labels).not.toContain('Usuarios');
    expect(labels).not.toContain('Productos');
  });

  it('filteredNavItems debe retornar array vacío si no hay rol', () => {
    authSpy.userRole.and.returnValue(null);
    expect(component.filteredNavItems.length).toBe(0);
  });
});
