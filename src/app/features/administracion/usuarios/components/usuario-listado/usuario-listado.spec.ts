import { ApplicationRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ToastrModule } from 'ngx-toastr';
import { provideAnimations } from '@angular/platform-browser/animations';
import { UsuarioListadoComponent } from './usuario-listado';
import { environment } from '../../../../../../environments/environment';

describe('UsuarioListadoComponent', () => {
  let component: UsuarioListadoComponent;
  let fixture: ComponentFixture<UsuarioListadoComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        UsuarioListadoComponent,
        CommonModule,
        RouterTestingModule,
        HttpClientTestingModule,
        ToastrModule.forRoot(),
      ],
      providers: [provideAnimations()],
    }).compileComponents();

    httpMock  = TestBed.inject(HttpTestingController);
    fixture   = TestBed.createComponent(UsuarioListadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('page debe comenzar en 0', () => {
    expect(component.page()).toBe(0);
  });

  it('pageSize debe comenzar en 10', () => {
    expect(component.pageSize()).toBe(10);
  });

  it('onPageChange debe actualizar la página', () => {
    component.onPageChange(3);
    expect(component.page()).toBe(3);
  });

  it('isLoading debe ser true mientras carga el recurso', () => {
    expect(component.isLoading()).toBeTrue();
  });

  it('usuarios, totalElements y totalPages deben retornar fallbacks mientras carga', () => {
    expect(component.usuarios()).toEqual([]);
    expect(component.totalElements()).toBe(0);
    expect(component.totalPages()).toBe(0);
  });

  it('usuarios debe tener items cuando el recurso carga con datos', async () => {
    const mockData = {
      content: [{ id: 1, name: 'Ana', email: 'ana@test.com', signUpDate: '2024-01-01', totalSpent: 0, role: { id: 2, name: 'CLIENT' } }],
      totalElements: 1,
      totalPages: 1,
      number: 0,
      size: 10
    };
    httpMock.expectOne(`${environment.apiUrl}/users?page=0&size=10`).flush(mockData);
    await Promise.resolve();
    TestBed.inject(ApplicationRef).tick();
    fixture.detectChanges();
    expect(component.usuarios().length).toBe(1);
    expect(component.totalElements()).toBe(1);
    expect(component.totalPages()).toBe(1);
    expect(component.isEmpty()).toBeFalse();
  });

  it('isEmpty debe ser true cuando el recurso carga con lista vacia', async () => {
    const mockData = { content: [], totalElements: 0, totalPages: 0, number: 0, size: 10 };
    httpMock.expectOne(`${environment.apiUrl}/users?page=0&size=10`).flush(mockData);
    await Promise.resolve();
    TestBed.inject(ApplicationRef).tick();
    fixture.detectChanges();
    expect(component.isEmpty()).toBeTrue();
  });

  it('hasError debe ser true cuando el recurso falla', async () => {
    httpMock.expectOne(`${environment.apiUrl}/users?page=0&size=10`)
      .flush('Error', { status: 500, statusText: 'Server Error' });
    await Promise.resolve();
    expect(component.hasError()).toBeTrue();
  });
});
