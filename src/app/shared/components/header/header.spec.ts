import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header';
import { AuthService } from '../../../core/auth/services/auth';
import { IdleService } from '../../../core/services/idle';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let authSpy: {
    currentUser: jasmine.Spy;
    userRole: jasmine.Spy;
    isLoggedIn: jasmine.Spy;
    logout: jasmine.Spy;
  };
  let idleSpy: { startWatching: jasmine.Spy; stopWatching: jasmine.Spy };

  beforeEach(async () => {
    authSpy = {
      currentUser:  jasmine.createSpy('currentUser').and.returnValue(null),
      userRole:     jasmine.createSpy('userRole').and.returnValue(null),
      isLoggedIn:   jasmine.createSpy('isLoggedIn').and.returnValue(false),
      logout:       jasmine.createSpy('logout'),
    };
    idleSpy = {
      startWatching: jasmine.createSpy('startWatching'),
      stopWatching:  jasmine.createSpy('stopWatching'),
    };

    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: IdleService, useValue: idleSpy },
      ],
    }).compileComponents();

    fixture   = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('logout debe llamar stopWatching y authService.logout', () => {
    component.logout();
    expect(idleSpy.stopWatching).toHaveBeenCalled();
    expect(authSpy.logout).toHaveBeenCalled();
  });
});
