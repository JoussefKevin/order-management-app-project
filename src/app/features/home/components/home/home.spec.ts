import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HomeComponent } from './home';
import { IdleService } from '../../../../core/services/idle';
import { AuthService } from '../../../../core/auth/services/auth';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let idleSpy: { startWatching: jasmine.Spy; stopWatching: jasmine.Spy };
  let authSpy: {
    currentUser:  jasmine.Spy;
    userRole:     jasmine.Spy;
    isLoggedIn:   jasmine.Spy;
    logout:       jasmine.Spy;
  };

  beforeEach(async () => {
    idleSpy = {
      startWatching: jasmine.createSpy('startWatching'),
      stopWatching:  jasmine.createSpy('stopWatching'),
    };
    authSpy = {
      currentUser:  jasmine.createSpy('currentUser').and.returnValue(null),
      userRole:     jasmine.createSpy('userRole').and.returnValue(null),
      isLoggedIn:   jasmine.createSpy('isLoggedIn').and.returnValue(false),
      logout:       jasmine.createSpy('logout'),
    };

    await TestBed.configureTestingModule({
      imports: [HomeComponent, RouterTestingModule],
      providers: [
        { provide: IdleService, useValue: idleSpy },
        { provide: AuthService, useValue: authSpy },
      ],
    }).compileComponents();

    fixture   = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit debe llamar startWatching', () => {
    expect(idleSpy.startWatching).toHaveBeenCalled();
  });

  it('ngOnDestroy debe llamar stopWatching', () => {
    component.ngOnDestroy();
    expect(idleSpy.stopWatching).toHaveBeenCalled();
  });
});
